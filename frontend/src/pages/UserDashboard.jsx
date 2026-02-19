import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);
  const [showLogs,setShowLogs] = useState(false);
  const [showLogsModal,setShowLogsModal] = useState(false);
  const [showAnalyticsModal,setShowAnalyticsModal] = useState(false);
  const [showUploadModal,setShowUploadModal] = useState(false);
  const [showWebcamModal,setShowWebcamModal] = useState(false);
  
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  // ===============================
  // FETCH USER DATA
  // ===============================
  const fetchUser = ()=>{
    axios.get("http://127.0.0.1:8000/dashboard/user-dashboard",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      setStats(res.data);
      setLogs(res.data.logs || []);
    })
    .catch(()=>{
      alert("Session expired login again");
      sessionStorage.clear();
      navigate("/");
    });
  }

  useEffect(()=>{ fetchUser(); },[]);

  // ===============================
  // LIVE SOCKET
  // ===============================
  useEffect(()=>{
    let ws;

    const connectSocket = ()=>{
      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onmessage = ()=> fetchUser();

      ws.onclose = ()=> setTimeout(connectSocket,2000);
    };

    connectSocket();
    return ()=> ws && ws.close();
  },[]);

  // ===============================
  // 🔴 LOGOUT WITH ACTIVE USER REMOVE
  // ===============================
  const logout = async () => {
    const email = sessionStorage.getItem("email");

    try{
      await axios.post("http://127.0.0.1:8000/auth/logout", { email });
    }catch(err){
      console.log("Logout sync error (ignored)");
    }

    sessionStorage.clear();
    navigate("/");
  };

  if(!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-cyan-400">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-sm sm:text-base">Loading Dashboard...</p>
      </div>
    </div>
  );

  return(
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ================= HEADER ================= */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest text-cyan-400 drop-shadow-[0_0_15px_cyan]">
                User Control Panel
              </h1>

              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-400 px-2 sm:px-0">
                Logged in as <span className="text-cyan-300 break-all">{email}</span>
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <button 
                onClick={logout}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>

          </div>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">

          <div className="bg-[#020617] border border-cyan-500 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan] transition-shadow">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">Total Detections</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-cyan-300 mt-2 sm:mt-3 font-bold">
              {stats.your_total_detections}
            </p>
          </div>

          <div className="bg-[#020617] border border-green-400 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_green] hover:shadow-[0_0_25px_green] transition-shadow">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">Mask Detected</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-green-400 mt-2 sm:mt-3 font-bold">
              {stats.mask_detected}
            </p>
          </div>

          <div className="bg-[#020617] border border-red-500 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_red] hover:shadow-[0_0_25px_red] transition-shadow sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">No Mask Detected</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-red-400 mt-2 sm:mt-3 font-bold">
              {stats.no_mask_detected}
            </p>
          </div>

        </div>

        {/* ================= BUTTONS (4 BUTTONS) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">

          {/* Upload Button */}
          <button
            onClick={()=>setShowUploadModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-cyan-500/10 border border-cyan-400 hover:bg-cyan-400 hover:text-black transition shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload</span>
          </button>

          {/* Webcam Button */}
          <button
            onClick={()=>setShowWebcamModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-purple-500/10 border border-purple-400 hover:bg-purple-400 hover:text-black transition shadow-[0_0_15px_purple] hover:shadow-[0_0_25px_purple] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Webcam</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={()=>setShowAnalyticsModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-blue-500/10 border border-blue-400 hover:bg-blue-400 hover:text-black transition shadow-[0_0_15px_blue] hover:shadow-[0_0_25px_blue] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </button>

          {/* View Logs Button */}
          <button
            onClick={()=>setShowLogsModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-yellow-500/10 border border-yellow-400 hover:bg-yellow-400 hover:text-black transition shadow-[0_0_15px_yellow] hover:shadow-[0_0_25px_yellow] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View Logs</span>
          </button>

        </div>

        {/* ================= LOGS ================= */}
        {showLogs && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-lg flex items-center justify-center border border-yellow-400/30">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl text-cyan-300 font-semibold">
                Your Detection Logs
              </h2>
            </div>

            {/* Desktop View - Table */}
            <div className="hidden lg:block w-full overflow-x-auto border border-cyan-500 rounded-lg shadow-[0_0_15px_cyan]">
              
              <div className="max-h-[500px] overflow-y-auto">

                <table className="w-full text-sm">

                  <thead className="bg-[#020617] border-b border-cyan-500 text-cyan-300 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-center font-semibold">Confidence</th>
                      <th className="p-4 text-center font-semibold">Source</th>
                      <th className="p-4 text-right font-semibold">Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center p-8 text-gray-400">
                          No logs available
                        </td>
                      </tr>
                    ) : (
                      logs.map((log,index)=>(
                        <tr key={index} className="border-b border-cyan-900 hover:bg-cyan-900/30 transition-colors">

                          <td className="text-left p-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              log.status==="Mask"
                              ? "bg-green-900/40 text-green-400 border border-green-500"
                              : "bg-red-900/40 text-red-400 border border-red-500"
                            }`}>
                              {log.status}
                            </span>
                          </td>

                          <td className="text-center p-4 text-cyan-300 font-mono">
                            {log.confidence?.toFixed(3)}
                          </td>

                          <td className="text-center p-4 text-yellow-300 capitalize">
                            {log.source}
                          </td>

                          <td className="text-right p-4 text-gray-400 text-xs">
                            {log.timestamp}
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>

                </table>

              </div>
            </div>

            {/* Mobile & Tablet View - Cards */}
            <div className="lg:hidden space-y-4">
              {logs.length === 0 ? (
                <div className="bg-[#020617] border border-cyan-500 rounded-lg p-6 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No logs available</p>
                </div>
              ) : (
                logs.map((log,index)=>(
                  <div 
                    key={index} 
                    className="bg-[#020617] border border-cyan-500 rounded-lg p-4 sm:p-5 shadow-[0_0_10px_cyan] hover:shadow-[0_0_20px_cyan] transition-shadow"
                  >
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                      <div>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                          log.status==="Mask"
                          ? "bg-green-900/40 text-green-400 border border-green-500"
                          : "bg-red-900/40 text-red-400 border border-red-500"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 mb-1">Detected at</p>
                        <p className="text-xs text-gray-400">{log.timestamp}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Confidence</p>
                        <p className="text-cyan-300 font-mono font-semibold">
                          {log.confidence?.toFixed(3)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Source</p>
                        <p className="text-yellow-300 font-medium capitalize">
                          {log.source}
                        </p>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>

      {/* ================= MODALS ================= */}
      {showUploadModal && (
        <UploadModal 
          onClose={()=>setShowUploadModal(false)} 
          token={token}
          onSuccess={fetchUser}
        />
      )}

      {showWebcamModal && (
        <WebcamModal 
          onClose={()=>setShowWebcamModal(false)} 
          token={token}
          onSuccess={fetchUser}
        />
      )}

      {showLogsModal && (
        <UserLogsModal
          onClose={()=>setShowLogsModal(false)}
          token={token}
        />
      )}

      {showAnalyticsModal && (
        <UserAnalyticsModal 
          onClose={()=>setShowAnalyticsModal(false)} 
          token={token}
        />
      )}

    </div>
  )
}

export default UserDashboard;

// ================= UPLOAD MODAL (USER) =================
function UploadModal({ onClose, token, onSuccess }) {
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isMask = result === "Mask";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please select a valid image file (JPG, PNG, or WebP)");
      setFile(null); setPreview(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setFile(null); setPreview(null);
      return;
    }

    setError(""); setResult("");
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const uploadImage = async () => {
    if (!file) { setError("Please select an image first"); return; }
    setLoading(true); setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/detect-image",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.prediction);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null); setPreview(null); setResult(""); setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      <div
        className="bg-[#0b1120]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(6,182,212,0.45)] flex flex-col"
        style={{ maxHeight: "92vh" }}
      >

        {/* ── Header ── */}
        <div className="flex-shrink-0 bg-[#0b1120] border-b border-cyan-500/30 px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400">Upload Image</h2>
              <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or WebP · Max 10MB</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5">

          {/* Preview or dropzone */}
          {preview ? (
            <div>
              {/* Image container with overlay */}
              <div
                className="relative rounded-xl overflow-hidden bg-black/40"
                style={{
                  aspectRatio: "16/9",
                  border: "2px solid",
                  borderColor: result
                    ? (isMask ? "rgba(34,197,94,0.65)" : "rgba(239,68,68,0.65)")
                    : "rgba(6,182,212,0.4)",
                  boxShadow: result
                    ? (isMask ? "0 0 28px rgba(34,197,94,0.25)" : "0 0 28px rgba(239,68,68,0.25)")
                    : "none",
                  transition: "border-color 0.3s, box-shadow 0.3s"
                }}
              >
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />

                {/* ── Result overlay at bottom of image — same as admin ── */}
                {result && (
                  <div className="absolute inset-x-0 bottom-0 animate-fadeIn pointer-events-none">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isMask
                          ? "linear-gradient(to top, rgba(0,30,15,0.90) 0%, transparent 100%)"
                          : "linear-gradient(to top, rgba(35,0,0,0.90) 0%, transparent 100%)"
                      }}
                    />
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 px-5 py-4 sm:px-7 sm:py-5">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0
                        ${isMask ? "bg-green-500/25 border-green-500/50" : "bg-red-500/25 border-red-500/50"}`}>
                        {isMask ? (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-base sm:text-xl lg:text-2xl font-bold tracking-widest leading-tight
                          ${isMask ? "text-green-400" : "text-red-400"}`}>
                          {isMask ? "MASK DETECTED" : "NO MASK DETECTED"}
                        </p>
                        <p className={`text-xs sm:text-sm mt-0.5 ${isMask ? "text-green-300/70" : "text-red-300/70"}`}>
                          {isMask ? "Face mask is properly worn." : "No face mask found in the image."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={resetUpload}
                  disabled={loading}
                  className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition z-20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* File info */}
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-400 truncate px-4">{file?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{(file?.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <label
              className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl cursor-pointer bg-black/20 hover:bg-black/30 transition group"
              style={{ minHeight: "320px" }}
            >
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-cyan-400 mb-4 group-hover:scale-105 transition-transform duration-200"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-base sm:text-lg text-cyan-400 font-semibold mb-2">Click to upload image</p>
              <p className="text-sm text-gray-500">JPG, PNG or WebP · Max 10MB</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
            </label>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 sm:p-4 rounded-lg border border-red-500/40 bg-red-500/10 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Detect button */}
          <button
            onClick={uploadImage}
            disabled={loading || !file}
            className={`w-full py-3 sm:py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg
              ${loading || !file
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20"}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>SCANNING...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>START DETECTION</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

// ================= WEBCAM MODAL (USER) =================
function WebcamModal({ onClose, token, onSuccess }) {
  const videoRef     = useRef(null);
  const captureRef   = useRef(null);
  const overlayRef   = useRef(null);
  const animFrameRef = useRef(null);
  const detectionRef = useRef({ result: "", confidence: 0, box: null });

  const [running,    setRunning]    = useState(false);
  const [result,     setResult]     = useState("");
  const [confidence, setConfidence] = useState(0);
  const [error,      setError]      = useState("");
  const [isLoading,  setIsLoading]  = useState(false);

  const isMask = result === "Mask";

  // ── Start Camera ──────────────────────────────────────────
  const startCamera = async () => {
    setIsLoading(true);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      detectionRef.current = { result: "", confidence: 0, box: null };
      setRunning(true);
      setResult("");
      setConfidence(0);
    } catch (err) {
      if (err.name === "NotAllowedError")
        setError("Camera access denied. Please allow camera permissions.");
      else if (err.name === "NotFoundError")
        setError("No camera found on this device.");
      else
        setError("Unable to access camera. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Stop Camera ───────────────────────────────────────────
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d");
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
    detectionRef.current = { result: "", confidence: 0, box: null };
    setRunning(false);
    setResult("");
    setConfidence(0);
    setError("");
  };

  // ── Send frame to API every 1.2s ─────────────────────────
  const sendFrame = async () => {
    const video   = videoRef.current;
    const capture = captureRef.current;
    if (!video || !capture) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    capture.width  = video.videoWidth;
    capture.height = video.videoHeight;
    capture.getContext("2d").drawImage(video, 0, 0, capture.width, capture.height);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/detect-webcam",
        { image: capture.toDataURL("image/jpeg") },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { prediction, confidence: conf, box } = res.data;
      if (prediction && prediction !== "No Face") {
        detectionRef.current = { result: prediction, confidence: conf, box: box || null };
        setResult(prediction);
        setConfidence(conf);
        onSuccess();
      } else if (prediction === "No Face") {
        detectionRef.current = { ...detectionRef.current, box: null };
      }
    } catch (e) {
      console.error("Frame detection error:", e);
    }
  };

  // ── rAF draw loop — bounding box chases face ──────────────
  const drawLoop = () => {
    const video   = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    const dw = video.offsetWidth;
    const dh = video.offsetHeight;
    if (overlay.width !== dw || overlay.height !== dh) {
      overlay.width  = dw;
      overlay.height = dh;
    }

    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, dw, dh);

    const { result: det, confidence: conf, box } = detectionRef.current;

    if (box && det && det !== "No Face") {
      const isMaskDet = det === "Mask";
      const color     = isMaskDet ? "#22c55e" : "#ef4444";
      const colorBg   = isMaskDet ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)";

      const sx = dw / (video.videoWidth  || dw);
      const sy = dh / (video.videoHeight || dh);
      const x  = box.x * sx;
      const y  = box.y * sy;
      const w  = box.w * sx;
      const h  = box.h * sy;

      // Fill + border
      ctx.fillStyle   = colorBg;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);

      // Corner accents
      const cLen = Math.min(w, h) * 0.20;
      ctx.lineWidth = 4;
      [
        [x,     y,      cLen,  0,    0,    cLen ],
        [x + w, y,     -cLen,  0,    0,    cLen ],
        [x,     y + h,  cLen,  0,    0,   -cLen ],
        [x + w, y + h, -cLen,  0,    0,   -cLen ],
      ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
        ctx.beginPath();
        ctx.moveTo(cx + dx1, cy + dy1);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx2, cy + dy2);
        ctx.stroke();
      });

      // Label pill
      const fontSize = Math.max(11, Math.min(15, w * 0.075));
      ctx.font       = `bold ${fontSize}px monospace`;
      const fullTxt  = `${isMaskDet ? "MASK" : "NO MASK"}   ${conf}%`;
      const pillW    = ctx.measureText(fullTxt).width + 18;
      const pillH    = fontSize + 12;
      const pillX    = Math.min(x, dw - pillW - 2);
      const pillY    = y - pillH - 5 < 0 ? y + 5 : y - pillH - 5;

      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, 4);
      else ctx.rect(pillX, pillY, pillW, pillH);
      ctx.fill();

      ctx.fillStyle    = "#ffffff";
      ctx.textBaseline = "middle";
      ctx.fillText(fullTxt, pillX + 9, pillY + pillH / 2);
    }

    animFrameRef.current = requestAnimationFrame(drawLoop);
  };

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(sendFrame, 1200);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (running) {
      animFrameRef.current = requestAnimationFrame(drawLoop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [running]);

  useEffect(() => { return () => stopCamera(); }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      <div
        className="bg-[#0b1120]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(168,85,247,0.55)] flex flex-col"
        style={{ maxHeight: "92vh" }}
      >

        {/* ── Header ── */}
        <div className="flex-shrink-0 bg-[#0b1120] border-b border-purple-500/30 px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400">Live Webcam</h2>
              <p className="text-xs text-gray-500 mt-0.5">Real-time mask detection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5">

          {/* Video container */}
          <div
            className="relative rounded-xl overflow-hidden bg-black"
            style={{
              aspectRatio: "16/9",
              border: "2px solid",
              borderColor: result && result !== "No Face"
                ? (isMask ? "rgba(34,197,94,0.65)" : "rgba(239,68,68,0.65)")
                : "rgba(168,85,247,0.45)",
              boxShadow: result && result !== "No Face"
                ? (isMask ? "0 0 28px rgba(34,197,94,0.25)" : "0 0 28px rgba(239,68,68,0.25)")
                : "0 0 20px rgba(168,85,247,0.15)",
              transition: "border-color 0.3s, box-shadow 0.3s"
            }}
          >
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Bounding box overlay canvas */}
            <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Camera off placeholder */}
            {!running && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-500">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm sm:text-base lg:text-lg text-gray-500">Camera is off</p>
              </div>
            )}

            {/* Starting spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-400" />
                <p className="text-purple-400 text-sm sm:text-base">Starting camera...</p>
              </div>
            )}

            {/* LIVE badge */}
            {running && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-red-500/50 z-10">
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white tracking-widest">LIVE</span>
              </div>
            )}

            {/* ── Result overlay at bottom of video — same as admin ── */}
            {result && result !== "No Face" && running && (
              <div className="absolute inset-x-0 bottom-0 animate-fadeIn pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background: isMask
                      ? "linear-gradient(to top, rgba(0,30,15,0.90) 0%, transparent 100%)"
                      : "linear-gradient(to top, rgba(35,0,0,0.90) 0%, transparent 100%)"
                  }}
                />
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4">
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0
                    ${isMask ? "bg-green-500/25 border-green-500/50" : "bg-red-500/25 border-red-500/50"}`}>
                    {isMask ? (
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm sm:text-xl font-bold tracking-widest leading-tight ${isMask ? "text-green-400" : "text-red-400"}`}>
                      {isMask ? "MASK DETECTED" : "NO MASK DETECTED"}
                    </p>
                    <p className={`text-xs sm:text-sm mt-0.5 ${isMask ? "text-green-300/70" : "text-red-300/70"}`}>
                      {isMask ? "Face mask is properly worn." : "No face mask found."}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1.5 bg-black/50 border border-cyan-500/30 px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">{confidence}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden capture canvas */}
          <canvas ref={captureRef} className="hidden" />

          {/* Error */}
          {error && (
            <div className="p-3 sm:p-4 rounded-lg border border-red-500/40 bg-red-500/10 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm sm:text-base text-red-400">{error}</p>
            </div>
          )}

          {/* Start / Stop button */}
          {!running ? (
            <button
              onClick={startCamera}
              disabled={isLoading}
              className={`w-full py-3 sm:py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg
                ${isLoading
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20"}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd" />
                  </svg>
                  <span>Start Camera</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 transition font-semibold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg text-white"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                  clipRule="evenodd" />
              </svg>
              <span>Stop Camera</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
// ================= USER ANALYTICS MODAL =================
const userAnalyticsScrollStyle = `
  .user-analytics-scroll::-webkit-scrollbar { width: 5px; }
  .user-analytics-scroll::-webkit-scrollbar-track { background: #020617; }
  .user-analytics-scroll::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.4); border-radius: 9999px; }
  .user-analytics-scroll::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.7); }
  .user-analytics-scroll { scrollbar-width: thin; scrollbar-color: rgba(6,182,212,0.4) #020617; }
`;

function UserAnalyticsModal({ onClose, token }) {
  const [data,  setData]  = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = () => {
      axios.get("http://127.0.0.1:8000/user/user-analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => { setData(res.data); setError(""); })
      .catch(() => setError("Failed to load analytics"));
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3000);
    return () => clearInterval(interval);
  }, [token]);

  // ── Loading ───────────────────────────────────────────────
  if (!data && !error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-10 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(6,182,212,0.45)]">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-cyan-400" />
          <p className="text-cyan-400 text-base font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  // Mask detection rate
  const total      = data?.total ?? 0;
  const mask       = data?.mask  ?? 0;
  const noMask     = data?.no_mask ?? 0;
  const maskRate   = total > 0 ? Math.round((mask   / total) * 100) : 0;
  const noMaskRate = total > 0 ? Math.round((noMask / total) * 100) : 0;

  return (
    <>
      <style>{userAnalyticsScrollStyle}</style>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
        <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto user-analytics-scroll shadow-[0_0_50px_rgba(6,182,212,0.45)]">

          {/* ── Header ── */}
          <div className="sticky top-0 bg-[#0b1120] border-b border-cyan-500/30 px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400">My Analytics</h2>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">Your personal detection stats</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8">

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm sm:text-base">{error}</p>
              </div>
            )}

            {data && (
              <>
                {/* ── Section 1: Detection Overview ── */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-cyan-300 uppercase tracking-widest">Detection Overview</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <UserStatCard
                      title="Total Detections"
                      value={total}
                      color="cyan"
                      icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      }
                    />
                    <UserStatCard
                      title="Mask Detected"
                      value={mask}
                      color="green"
                      icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      }
                    />
                    <UserStatCard
                      title="No Mask"
                      value={noMask}
                      color="red"
                      icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      }
                    />
                  </div>
                </div>

                {/* ── Detection Rate Bar ── */}
                {total > 0 && (
                  <div className="bg-[#020617] border border-cyan-500/30 rounded-xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold text-cyan-300 uppercase tracking-widest">Detection Rate</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{total} total</span>
                    </div>
                    <div className="flex rounded-full overflow-hidden h-4 sm:h-5 gap-0.5">
                      <div
                        className="bg-green-500 flex items-center justify-center transition-all duration-700"
                        style={{ width: `${maskRate}%` }}
                      >
                        {maskRate > 12 && <span className="text-xs font-bold text-white">{maskRate}%</span>}
                      </div>
                      <div
                        className="bg-red-500 flex items-center justify-center transition-all duration-700"
                        style={{ width: `${noMaskRate}%` }}
                      >
                        {noMaskRate > 12 && <span className="text-xs font-bold text-white">{noMaskRate}%</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-400">Mask ({maskRate}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-xs text-gray-400">No Mask ({noMaskRate}%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Section 2: Source Breakdown ── */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-cyan-300 uppercase tracking-widest">Source Breakdown</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <UserStatCard
                      title="Webcam"
                      value={data.webcam ?? 0}
                      color="purple"
                      icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                    <UserStatCard
                      title="Upload"
                      value={data.upload ?? 0}
                      color="yellow"
                      icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      }
                    />
                    <UserStatCard
                      title="Today"
                      value={data.today ?? 0}
                      color="pink"
                      icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── User StatCard ─────────────────────────────────────────────────────
function UserStatCard({ title, value, color, icon }) {
  const styles = {
    cyan:   { border: "border-cyan-500/50",   text: "text-cyan-300",   iconBg: "bg-cyan-500/15   border-cyan-500/30"   },
    green:  { border: "border-green-500/50",  text: "text-green-400",  iconBg: "bg-green-500/15  border-green-500/30"  },
    red:    { border: "border-red-500/50",    text: "text-red-400",    iconBg: "bg-red-500/15    border-red-500/30"    },
    purple: { border: "border-purple-500/50", text: "text-purple-400", iconBg: "bg-purple-500/15 border-purple-500/30" },
    yellow: { border: "border-yellow-500/50", text: "text-yellow-400", iconBg: "bg-yellow-500/15 border-yellow-500/30" },
    pink:   { border: "border-pink-500/50",   text: "text-pink-400",   iconBg: "bg-pink-500/15   border-pink-500/30"   },
  };

  const s = styles[color] || styles.cyan;

  return (
    <div className={`bg-[#020617] border ${s.border} rounded-xl p-5 sm:p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200`}>
      <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
        <div className={`w-5 h-5 sm:w-6 sm:h-6 ${s.text}`}>
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-400 font-medium mb-0.5">{title}</p>
        <p className={`text-3xl sm:text-4xl font-bold font-mono ${s.text}`}>
          {value !== undefined ? value : "0"}
        </p>
      </div>
    </div>
  );
}
// ================= USER LOGS MODAL =================
function UserLogsModal({ onClose, token }) {
  const [allLogs,      setAllLogs]      = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [logsPerPage,  setLogsPerPage]  = useState(10);
  const [filters, setFilters] = useState({ status: 'all', source: 'all', search: '' });

  // ── Fetch user's own logs ─────────────────────────────────
  useEffect(() => {
    setFetchLoading(true);
    axios.get("http://127.0.0.1:8000/user/user-logs", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const logs = res.data.logs || [];
      setAllLogs(logs);
      setFilteredLogs(logs);
    })
    .catch(() => setFetchError("Failed to load logs. Please try again."))
    .finally(() => setFetchLoading(false));
  }, [token]);

  // ── Apply filters ──────────────────────────────────────────
  useEffect(() => {
    let result = [...allLogs];
    if (filters.status !== 'all') result = result.filter(l => l.status === filters.status);
    if (filters.source !== 'all') result = result.filter(l => l.source === filters.source);
    if (filters.search)           result = result.filter(l => l.timestamp?.toLowerCase().includes(filters.search.toLowerCase()));
    setFilteredLogs(result);
    setCurrentPage(1);
  }, [filters, allLogs]);

  useEffect(() => { setCurrentPage(1); }, [logsPerPage]);

  // ── Pagination ─────────────────────────────────────────────
  const totalPages   = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfFirst = (currentPage - 1) * logsPerPage;
  const indexOfLast  = Math.min(indexOfFirst + logsPerPage, filteredLogs.length);
  const currentLogs  = filteredLogs.slice(indexOfFirst, indexOfLast);

  const handleFilter   = (key, val) => setFilters(p => ({ ...p, [key]: val }));
  const resetFilters   = () => setFilters({ status: 'all', source: 'all', search: '' });
  const hasActiveFilter = filters.status !== 'all' || filters.source !== 'all' || filters.search;

  // Smart ellipsis page numbers
  const getPageNums = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(p => p >= 1 && p <= totalPages));
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push('...');
      result.push(p);
    });
    return result;
  };

  // Source icon + color helper
  const getSourceStyle = (source) => {
    const s = source?.toLowerCase();
    if (s === 'webcam') return { color: 'text-yellow-400', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    )};
    if (s === 'upload') return { color: 'text-blue-400', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
    )};
    return { color: 'text-gray-400', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
      </svg>
    )};
  };

  const inputClass  = "w-full px-3 py-2 bg-[#020617] border border-cyan-500/30 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-colors placeholder:text-gray-600";
  const selectClass = "w-full pl-3 pr-8 py-2 bg-[#020617] border border-cyan-500/30 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-colors appearance-none cursor-pointer";

  return (
    <>
      <style>{`
        .user-logs-scroll::-webkit-scrollbar { width: 5px; }
        .user-logs-scroll::-webkit-scrollbar-track { background: #020617; }
        .user-logs-scroll::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.4); border-radius: 9999px; }
        .user-logs-scroll::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.7); }
        .user-logs-scroll { scrollbar-width: thin; scrollbar-color: rgba(6,182,212,0.4) #020617; }
      `}</style>

      <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-2 sm:p-3 lg:p-6 animate-fadeIn">
        <div
          className="bg-[#0b1120]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-5xl shadow-[0_0_50px_rgba(6,182,212,0.45)] flex flex-col"
          style={{ maxHeight: "95vh" }}
        >

          {/* ── Header ── */}
          <div className="flex-shrink-0 bg-[#0b1120] border-b border-cyan-500/30 px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400">My Detection Logs</h2>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  {fetchLoading ? "Loading..." : `${allLogs.length} total records`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Filters ── */}
          <div className="flex-shrink-0 bg-[#0b1120]/80 border-b border-cyan-500/20 px-5 py-4 sm:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">

              {/* Search by timestamp */}
              <div className="col-span-2 lg:col-span-1">
                <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Search by Date
                </label>
                <input type="text" placeholder="e.g. 2026-02-18..." value={filters.search}
                  onChange={e => handleFilter('search', e.target.value)} className={inputClass} />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Status
                </label>
                <div className="relative">
                  <select value={filters.status} onChange={e => handleFilter('status', e.target.value)} className={selectClass}>
                    <option value="all">All Status</option>
                    <option value="Mask">Mask</option>
                    <option value="No Mask">No Mask</option>
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Source
                </label>
                <div className="relative">
                  <select value={filters.source} onChange={e => handleFilter('source', e.target.value)} className={selectClass}>
                    <option value="all">All Sources</option>
                    <option value="webcam">Webcam</option>
                    <option value="upload">Upload</option>
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Results + reset */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500 font-mono">
                Showing <span className="text-cyan-400 font-semibold">{currentLogs.length}</span> of{" "}
                <span className="text-cyan-400 font-semibold">{filteredLogs.length}</span> logs
              </p>
              {hasActiveFilter && (
                <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* ── Scrollable table ── */}
          <div className="flex-1 overflow-y-auto min-h-0 user-logs-scroll">

            {/* Loading */}
            {fetchLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
                <p className="text-cyan-400 text-sm">Fetching your logs...</p>
              </div>
            )}

            {/* Error */}
            {fetchError && !fetchLoading && (
              <div className="m-5 p-4 rounded-xl border border-red-500/40 bg-red-500/10 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-red-400 text-sm">{fetchError}</p>
              </div>
            )}

            {!fetchLoading && !fetchError && (
              <>
                {/* ── Desktop table ── */}
                <div className="hidden lg:block">
                  <table className="w-full text-sm">
                    <thead className="bg-[#020617] border-b border-cyan-500/30 sticky top-0 z-10">
                      <tr>
                        {[
                          { label: 'Status',     align: 'text-left'   },
                          { label: 'Confidence', align: 'text-center' },
                          { label: 'Source',     align: 'text-center' },
                          { label: 'Time',       align: 'text-right'  },
                        ].map(h => (
                          <th key={h.label} className={`px-5 py-3.5 ${h.align} text-xs font-semibold text-cyan-300 uppercase tracking-widest`}>
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-900/20">
                      {currentLogs.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-16 text-gray-500">
                            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            {allLogs.length === 0 ? "No logs available" : "No logs match your filters"}
                          </td>
                        </tr>
                      ) : currentLogs.map((log, i) => {
                        const src = getSourceStyle(log.source);
                        return (
                          <tr key={i} className="hover:bg-cyan-900/10 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                ${log.status === "Mask"
                                  ? "bg-green-900/30 text-green-400 border border-green-500/40"
                                  : "bg-red-900/30 text-red-400 border border-red-500/40"}`}>
                                {log.status === "Mask" ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                                  </svg>
                                )}
                                {log.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono text-cyan-300 text-sm">
                              {typeof log.confidence === 'number' ? log.confidence.toFixed(3) : log.confidence}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${src.color}`}>
                                {src.icon}
                                {log.source}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono text-xs text-gray-500">{log.timestamp}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ── Mobile cards ── */}
                <div className="lg:hidden p-4 sm:p-5 space-y-3">
                  {currentLogs.length === 0 ? (
                    <div className="bg-[#020617] border border-cyan-500/30 rounded-xl p-8 text-center text-gray-500 text-sm">
                      {allLogs.length === 0 ? "No logs available" : "No logs match your filters"}
                    </div>
                  ) : currentLogs.map((log, i) => {
                    const src = getSourceStyle(log.source);
                    return (
                      <div key={i} className="bg-[#020617] border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                            ${log.status === "Mask"
                              ? "bg-green-900/30 text-green-400 border border-green-500/40"
                              : "bg-red-900/30 text-red-400 border border-red-500/40"}`}>
                            {log.status === "Mask" ? (
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                              </svg>
                            ) : (
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            )}
                            {log.status}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium capitalize ${src.color}`}>
                            {src.icon}
                            {log.source}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cyan-900/30">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Confidence</p>
                            <p className="text-xs text-cyan-300 font-mono">
                              {typeof log.confidence === 'number' ? log.confidence.toFixed(3) : log.confidence}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Time</p>
                            <p className="text-xs text-gray-400 font-mono">{log.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* ── Pagination footer ── */}
          {!fetchLoading && filteredLogs.length > 0 && (
            <div className="flex-shrink-0 bg-[#0b1120]/90 border-t border-cyan-500/20 px-5 py-3 sm:px-8 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Left: per page + count + reset */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={logsPerPage}
                      onChange={e => setLogsPerPage(Number(e.target.value))}
                      className="pl-3 pr-7 py-1.5 bg-[#020617] border border-cyan-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
                    >
                      {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                    {indexOfFirst + 1}–{indexOfLast} of {filteredLogs.length}
                  </span>
                  <button
                    onClick={() => { setCurrentPage(1); resetFilters(); }}
                    title="Reset"
                    className="p-1.5 hover:bg-white/10 rounded-lg transition text-gray-500 hover:text-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </button>
                </div>

                {/* Right: page numbers */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1.5 rounded-lg transition ${currentPage === 1 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>

                    {getPageNums().map((p, i) =>
                      p === '...' ? (
                        <span key={`e-${i}`} className="w-7 text-center text-gray-600 text-xs">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition ${
                            currentPage === p
                              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                              : 'text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-1.5 rounded-lg transition ${currentPage === totalPages ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}