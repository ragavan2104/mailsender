import { useState, useEffect } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { useAuth } from '../AuthContext'
import { API_ENDPOINTS } from '../config/api'
import Toast from './Toast'
import ProgressBar from './ProgressBar'

function EmailComposer() {
  const [msg, setMsg] = useState("")
  const [subject, setSubject] = useState("")
  const [status, setStatus] = useState(false)
  const [emails, setEmails] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState("")
  const [sendingProgress, setSendingProgress] = useState(0)
  const [toast, setToast] = useState(null)
  const [emailPreview, setEmailPreview] = useState(false)
  const [campaignStats, setCampaignStats] = useState({
    totalSent: 0,
    successRate: 0,
    lastCampaign: null
  })

  const { getAuthHeaders } = useAuth();

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get valid emails count
  const validEmails = emails.filter(email => isValidEmail(email));

  // Toast notification system
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }

  // Load campaign stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('campaignStats');
    if (savedStats) {
      setCampaignStats(JSON.parse(savedStats));
    }
  }, []);

  // Save campaign stats to localStorage
  const updateCampaignStats = (newStats) => {
    const updatedStats = { ...campaignStats, ...newStats };
    setCampaignStats(updatedStats);
    localStorage.setItem('campaignStats', JSON.stringify(updatedStats));
  };

  function handleChange(e) {
    setMsg(e.target.value)
  }

  function handleSubjectChange(e) {
    setSubject(e.target.value)
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcessing(e.dataTransfer.files[0])
    }
  }

  // Handle file input change
  function handlefile(event) {
    const file = event.target.files[0];
    if (file) {
      handleFileProcessing(file)
    }
  }

  // Process the uploaded file
  function handleFileProcessing(file) {
    setFileName(file.name)
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header:"A"});
      const emailList = jsonData.map(item => item.A).filter(email => email);
      setEmails(emailList);
    }
    reader.readAsBinaryString(file);
  }

  function send(){
    if (validEmails.length === 0) {
      showToast("Please upload a file with valid email addresses first!", "error");
      return;
    }
    
    if (!subject.trim()) {
      showToast("Please enter a subject line for your email!", "error");
      return;
    }
    
    if (!msg.trim()) {
      showToast("Please enter a message to send!", "error");
      return;
    }

    setStatus(true);
    setSendingProgress(0);
    showToast("Starting email campaign...", "info");
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setSendingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Send only valid emails to the backend
    axios.post(API_ENDPOINTS.SEND_MAIL, {
      msg: msg, 
      emails: validEmails,
      subject: subject
    }, {
      headers: getAuthHeaders()
    })
      .then(response => {
        clearInterval(progressInterval);
        setSendingProgress(100);
        console.log("Success:", response.data);
        const { summary } = response.data;
        
        // Update campaign stats
        updateCampaignStats({
          totalSent: campaignStats.totalSent + summary.successful,
          successRate: Math.round((summary.successful / summary.total) * 100),
          lastCampaign: new Date().toLocaleDateString()
        });
        
        showToast(`✅ Campaign completed! ${summary.successful}/${summary.total} emails sent successfully`, "success");
        setStatus(false);
        setSendingProgress(0);
      })
      .catch(error => {
        clearInterval(progressInterval);
        console.error("Error:", error);
        const errorMessage = error.response?.data?.error || "Failed to send emails. Please check server connection.";
        showToast(`❌ ${errorMessage}`, "error");
        setStatus(false);
        setSendingProgress(0);
      });
  }

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ProgressBar status={status} progress={sendingProgress} />

      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mb-4 text-responsive-lg">
          ✍️ Compose Campaign
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Create and send personalized email campaigns to your audience
        </p>
        
        {/* Campaign Stats Preview */}
        {campaignStats.totalSent > 0 && (
          <div className="mt-6 inline-flex items-center space-x-6 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{campaignStats.totalSent}</div>
              <div className="text-sm text-gray-400">Total Sent</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{campaignStats.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            {campaignStats.lastCampaign && (
              <>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-400">{campaignStats.lastCampaign}</div>
                  <div className="text-xs text-gray-400">Last Campaign</div>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Email Composer */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Compose Your Campaign
                </h2>
                <button
                  onClick={() => setEmailPreview(!emailPreview)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200"
                >
                  {emailPreview ? '📝 Edit' : '👁️ Preview'}
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {!emailPreview ? (
                <>
                  {/* Subject Line */}
                  <div>
                    <label className="block text-white font-semibold mb-3 text-lg">
                      📧 Email Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={handleSubjectChange}
                      className="w-full px-6 py-4 bg-white/5 border-2 border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 text-lg"
                      placeholder="Enter your compelling subject line..."
                    />
                    <div className="mt-2 text-sm text-gray-400">
                      {subject.length}/100 characters
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label className="block text-white font-semibold mb-3 text-lg">
                      ✍️ Email Content
                    </label>
                    <textarea
                      value={msg}
                      onChange={handleChange}
                      rows="12"
                      className="w-full px-6 py-4 bg-white/5 border-2 border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 resize-none text-lg leading-relaxed"
                      placeholder="Craft your personalized message here... Use {{name}} for recipient names and {{email}} for personalization."
                    />
                    <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                      <span>{msg.length} characters</span>
                      <span>💡 Pro tip: Keep it concise and engaging</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Email Preview */
                <div className="bg-white/5 rounded-2xl p-6 border border-purple-500/30">
                  <div className="bg-white rounded-lg p-6 text-gray-800">
                    <div className="border-b pb-4 mb-4">
                      <div className="text-sm text-gray-600 mb-2">Subject:</div>
                      <div className="font-bold text-lg">{subject || 'Your Subject Line'}</div>
                    </div>
                    <div className="whitespace-pre-wrap">{msg || 'Your email content will appear here...'}</div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-gray-400 text-sm">📱 This preview shows how your email will look to recipients</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload & Controls */}
          <div className="space-y-6">
            
            {/* File Upload Area */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden card-hover">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Upload Recipients
                </h2>
              </div>
              
              <div className="p-6">
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 file-upload-bounce ${
                    dragActive 
                      ? 'border-cyan-400 bg-cyan-400/10 scale-105' 
                      : 'border-gray-400 hover:border-cyan-400 hover:bg-white/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="text-6xl animate-bounce">📁</div>
                    <div>
                      <p className="text-xl font-bold text-white mb-2">
                        Drop your file here
                      </p>
                      <p className="text-gray-400 mb-4">
                        CSV, Excel files supported
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        onChange={handlefile}
                        accept=".csv,.xlsx,.xls"
                      />
                      <label
                        htmlFor="fileInput"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg button-click"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Browse Files
                      </label>
                    </div>
                    {fileName && (
                      <div className="text-sm text-green-400 mt-2 animate-fade-in">
                        📎 {fileName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                </svg>
                Campaign Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-4 border border-emerald-500/30">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{emails.length}</div>
                  <div className="text-sm text-emerald-300 font-medium">Total Emails</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-4 border border-blue-500/30">
                  <div className="text-3xl font-black text-blue-400 mb-1">{validEmails.length}</div>
                  <div className="text-sm text-blue-300 font-medium">Valid Emails</div>
                </div>
              </div>
              {emails.length > 0 && validEmails.length !== emails.length && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-300 text-sm font-medium">
                    ⚠️ {emails.length - validEmails.length} invalid email(s) will be skipped
                  </p>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={send}
              disabled={status || validEmails.length === 0 || !subject.trim() || !msg.trim()}
              className={`w-full py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 button-click relative overflow-hidden ${
                status || validEmails.length === 0 || !subject.trim() || !msg.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25 animate-pulse-glow'
              }`}
            >
              {status ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin-glow -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="flex flex-col">
                    <span>Sending Campaign...</span>
                    <span className="text-sm opacity-75">{Math.round(sendingProgress)}% complete</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Launch Campaign
                </div>
              )}
              
              {/* Shimmer effect when ready */}
              {!status && validEmails.length > 0 && subject.trim() && msg.trim() && (
                <div className="absolute inset-0 shimmer opacity-30"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailComposer;
