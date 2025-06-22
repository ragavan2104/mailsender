const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const nodemailer = require("nodemailer");

// Environment Configuration
console.log('Starting MailBlaster Pro API Server...');
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('CORS configured for:', CORS_ORIGIN);

// CORS Configuration for production - Simplified for Vercel serverless
const corsOptions = {
  origin: [
    'https://mailsender-81o2.vercel.app',  // ✅ LATEST FRONTEND URL
    'https://mailsender-vert.vercel.app',  // ✅ PREVIOUS FRONTEND URL
    'https://mailsender-r7un-bwnck6t1g-raagavans-projects.vercel.app',
    'https://mailsender-rfe.vercel.app',
    'https://mailsender-uqwc-m3qjdrzcl-raagavans-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5176',  // ✅ Updated dev port
    'http://localhost:5177'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Middleware should be defined before routes
app.use(cors(corsOptions))
app.use(express.json())

// Handle preflight requests explicitly for all routes
app.options('*', cors(corsOptions));

// Root endpoint - API information
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MailBlaster Pro API Server',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /register',
        login: 'POST /login',
        me: 'GET /me'
      },
      email: {
        sendBulk: 'POST /sendmail',
        sendSingle: 'POST /sendmail/single',
        history: 'GET /email-history',
        stats: 'GET /dashboard-stats'
      }
    },
    documentation: 'https://github.com/ragavan2104/mail-sender'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global variables to store transporter and sender email
let transporter = null;
let senderEmail = null;
let mongoConnected = false;
let mongoConnecting = false;

// Email History Schema
const emailHistorySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  recipients: [{ 
    email: String, 
    status: String, 
    messageId: String, 
    error: String 
  }],
  totalRecipients: { type: Number, required: true },
  successfulSends: { type: Number, required: true },
  failedSends: { type: Number, required: true },
  sentAt: { type: Date, default: Date.now },
  sentBy: { type: String, default: "admin" }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const EmailHistory = mongoose.model("EmailHistory", emailHistorySchema);
const Admin = mongoose.model("Admin", adminSchema);

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Lazy database connection for serverless
async function connectToDatabase() {
  if (mongoConnected) {
    return true;
  }
  
  if (mongoConnecting) {
    // Wait for existing connection attempt
    while (mongoConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return mongoConnected;
  }
  
  try {
    mongoConnecting = true;
    console.log("Connecting to MongoDB...");
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
    
    console.log("Connected to MongoDB Atlas successfully");
    mongoConnected = true;
    
    // Initialize email credentials
    await initializeEmailCredentials();
    
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  } finally {
    mongoConnecting = false;
  }
}

// Initialize email credentials
async function initializeEmailCredentials() {
  try {
    const credentialsSchema = new mongoose.Schema({
      user: String,
      pass: String
    });
    
    const credentials = mongoose.model("credentials", credentialsSchema, "bulkmail");
    const data = await credentials.find();
    
    if (data && data.length > 0) {
      const emailCreds = data[0].toJSON();
      senderEmail = emailCreds.user;
      
      transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: emailCreds.user,
          pass: emailCreds.pass,
        },
      });
      
      console.log("Email transporter initialized");
      console.log(`Sender email: ${senderEmail}`);
    } else {
      console.error("No credentials found in MongoDB database!");
    }
  } catch (error) {
    console.error("Error initializing email credentials:", error);
  }
}

// Database connection middleware for routes that need it
const requireDatabase = async (req, res, next) => {
  const connected = await connectToDatabase();
  if (!connected) {
    return res.status(503).json({ 
      error: "Database connection failed", 
      message: "Unable to connect to MongoDB. Please try again later." 
    });
  }
  next();
};

// Authentication endpoints
app.post("/register", requireDatabase, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", requireDatabase, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user info
app.get("/me", authenticateToken, requireDatabase, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email History endpoints
app.get("/email-history", authenticateToken, requireDatabase, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalEmails = await EmailHistory.countDocuments();
    const emails = await EmailHistory.find()
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-recipients'); // Exclude detailed recipient info for list view

    res.json({
      emails,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalEmails / limit),
        totalEmails,
        hasMore: skip + emails.length < totalEmails
      }
    });
  } catch (error) {
    console.error("Email history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get detailed email history by ID
app.get("/email-history/:id", authenticateToken, requireDatabase, async (req, res) => {
  try {
    const email = await EmailHistory.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ error: "Email record not found" });
    }
    res.json(email);
  } catch (error) {
    console.error("Email detail error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard statistics
app.get("/dashboard-stats", authenticateToken, requireDatabase, async (req, res) => {
  try {
    const totalCampaigns = await EmailHistory.countDocuments();
    const totalEmailsSent = await EmailHistory.aggregate([
      { $group: { _id: null, total: { $sum: "$successfulSends" } } }
    ]);
    const totalEmailsFailed = await EmailHistory.aggregate([
      { $group: { _id: null, total: { $sum: "$failedSends" } } }
    ]);

    // Recent campaigns (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCampaigns = await EmailHistory.countDocuments({
      sentAt: { $gte: sevenDaysAgo }
    });

    // Success rate calculation
    const totalSent = totalEmailsSent[0]?.total || 0;
    const totalFailed = totalEmailsFailed[0]?.total || 0;
    const successRate = totalSent + totalFailed > 0 ? 
      Math.round((totalSent / (totalSent + totalFailed)) * 100) : 0;

    res.json({
      totalCampaigns,
      totalEmailsSent: totalSent,
      totalEmailsFailed: totalFailed,
      recentCampaigns,
      successRate
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Bulk email send endpoint
app.post("/sendmail", authenticateToken, requireDatabase, async (req, res) => {
  try {
    // Check if transporter is available (credentials loaded from MongoDB)
    if (!transporter) {
      return res.status(503).json({ 
        error: "Email service not available", 
        message: "Unable to connect to MongoDB or fetch email credentials. Please check database connection." 
      });
    }

    var msg = req.body.msg;
    var emails = req.body.emails;
    var subject = req.body.subject || "Newsletter"; // Use provided subject or default

    // Validate required fields
    if (!msg) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "Email list is required" });
    }

    console.log(`Sending email with subject "${subject}" to ${emails.length} recipients...`);
    
    const results = [];
    
    // Send emails to all recipients
    for (let i = 0; i < emails.length; i++) {
      try {
        const info = await transporter.sendMail({
          from: senderEmail,
          to: emails[i],
          subject: subject,
          text: msg
        });
        
        console.log(`Email sent successfully to: ${emails[i]}`);
        results.push({ 
          email: emails[i], 
          status: "success", 
          messageId: info.messageId 
        });
        
      } catch (emailError) {
        console.error(`Failed to send email to ${emails[i]}:`, emailError.message);
        results.push({ 
          email: emails[i], 
          status: "failed", 
          error: emailError.message 
        });
      }
    }

    // Count successful and failed emails
    const successful = results.filter(r => r.status === "success").length;
    const failed = results.filter(r => r.status === "failed").length;

    // Save to email history
    const emailRecord = new EmailHistory({
      subject: subject,
      body: msg,
      recipients: results,
      totalRecipients: emails.length,
      successfulSends: successful,
      failedSends: failed,
      sentBy: req.user.username
    });

    await emailRecord.save();
    console.log("Email campaign saved to history");

    res.status(200).json({
      message: `Email sending completed`,
      summary: {
        total: emails.length,
        successful: successful,
        failed: failed
      },
      results: results,
      historyId: emailRecord._id
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
});

// Single email send endpoint (for testing)
app.post("/sendmail/single", requireDatabase, async (req, res) => {
  try {
    // Check if transporter is available (credentials loaded from MongoDB)
    if (!transporter) {
      return res.status(503).json({ 
        error: "Email service not available", 
        message: "Unable to connect to MongoDB or fetch email credentials. Please check database connection." 
      });
    }

    const { msg, email, subject } = req.body;

    if (!msg || !email) {
      return res.status(400).json({ error: "Message and email are required" });
    }

    const info = await transporter.sendMail({
      from: senderEmail,
      to: email,
      subject: subject || "Newsletter",
      text: msg
    });

    console.log(`Single email sent successfully to: ${email}`);
    res.status(200).json({
      message: "Email sent successfully",
      email: email,
      messageId: info.messageId
    });

  } catch (error) {
    console.error("Error sending single email:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error.message
    });  }
});

// Global error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /register',
      'POST /login',
      'GET /me',
      'POST /sendmail',
      'POST /sendmail/single',
      'GET /email-history',
      'GET /dashboard-stats'
    ]
  });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}....`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
