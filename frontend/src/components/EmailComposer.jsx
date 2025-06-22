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
        
        showToast(`Campaign completed! ${summary.successful}/${summary.total} emails sent successfully`, "success");
        setStatus(false);
        setSendingProgress(0);
      })
      .catch(error => {
        clearInterval(progressInterval);
        console.error("Error:", error);
        const errorMessage = error.response?.data?.error || "Failed to send emails. Please check server connection.";
        showToast(`${errorMessage}`, "error");
        setStatus(false);
        setSendingProgress(0);
      });
  }

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ProgressBar status={status} progress={sendingProgress} />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Compose Campaign
        </h1>
        <p className="text-lg text-gray-600">
          Create and send personalized email campaigns to your audience
        </p>
        
        {/* Campaign Stats Preview */}
        {campaignStats.totalSent > 0 && (
          <div className="mt-6 inline-flex items-center space-x-6 bg-white rounded-xl px-6 py-3 shadow-soft border border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{campaignStats.totalSent}</div>
              <div className="text-sm text-gray-500">Total Sent</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{campaignStats.successRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            {campaignStats.lastCampaign && (
              <>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{campaignStats.lastCampaign}</div>
                  <div className="text-xs text-gray-500">Last Campaign</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Email Composer */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Compose Your Campaign
              </h2>
              <button
                onClick={() => setEmailPreview(!emailPreview)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-white font-medium transition-smooth"
              >
                {emailPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {!emailPreview ? (
              <>
                {/* Subject Line */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={handleSubjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                    placeholder="Enter your compelling subject line..."
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {subject.length}/100 characters
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    id="message"
                    value={msg}
                    onChange={handleChange}
                    rows="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth resize-none"
                    placeholder="Craft your personalized message here... Use {{name}} for recipient names and {{email}} for personalization."
                  />
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{msg.length} characters</span>
                    <span>💡 Pro tip: Keep it concise and engaging</span>
                  </div>
                </div>
              </>
            ) : (
              /* Email Preview */
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-white rounded-lg p-6 shadow-soft">
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="text-sm text-gray-600 mb-2">Subject:</div>
                    <div className="font-semibold text-lg text-gray-900">{subject || 'Your Subject Line'}</div>
                  </div>
                  <div className="whitespace-pre-wrap text-gray-800">{msg || 'Your email content will appear here...'}</div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-gray-500 text-sm">📱 This preview shows how your email will look to recipients</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Upload & Controls */}
        <div className="space-y-6">
          
          {/* File Upload Area */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Upload Recipients
              </h3>
            </div>
            
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-smooth ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your file here
                    </p>
                    <p className="text-gray-600 mb-4">
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
                      className="inline-flex items-center px-4 py-2 gradient-primary text-white font-medium rounded-lg hover:shadow-lg transition-smooth btn-hover-lift cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      Browse Files
                    </label>
                  </div>
                  {fileName && (
                    <div className="text-sm text-green-600 mt-2">
                      📎 {fileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
              </svg>
              Campaign Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">{emails.length}</div>
                <div className="text-sm text-green-700 font-medium">Total Emails</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">{validEmails.length}</div>
                <div className="text-sm text-blue-700 font-medium">Valid Emails</div>
              </div>
            </div>
            {emails.length > 0 && validEmails.length !== emails.length && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ {emails.length - validEmails.length} invalid email(s) will be skipped
                </p>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={send}
            disabled={status || validEmails.length === 0 || !subject.trim() || !msg.trim()}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-smooth btn-hover-lift ${
              status || validEmails.length === 0 || !subject.trim() || !msg.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'gradient-primary text-white hover:shadow-lg'
            }`}
          >
            {status ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Launch Campaign
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailComposer;
