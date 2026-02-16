import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

function AdminDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);
  const [showUploadModal,setShowUploadModal] = useState(false);
  const [showWebcamModal,setShowWebcamModal] = useState(false);
  const [showLogsModal,setShowLogsModal] = useState(false);
  const [showAnalyticsModal,setShowAnalyticsModal] = useState(false);
  
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  // ===============================
  // FETCH ADMIN DATA
  // ===============================
  const fetchAdmin = ()=>{
    axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      setStats(res.data);
      setLogs(res.data.logs || []);
    })
    .catch(()=>{
      alert("Session expired login again");
      sessionStorage.clear();
      window.location="/";
    });
  }

  useEffect(()=>{ fetchAdmin(); },[]);

  // ===============================
  // LIVE SOCKET
  // ===============================
  useEffect(()=>{
    let ws;

    const connectSocket = ()=>{
      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onmessage = ()=> fetchAdmin();

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
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-purple-400">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-sm sm:text-base">Loading Admin Dashboard...</p>
      </div>
    </div>
  );

  return(
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ================= HEADER ================= */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest text-purple-400 drop-shadow-[0_0_15px_purple]">
                Admin Control Panel
              </h1>

              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-400 px-2 sm:px-0">
                Logged in as <span className="text-purple-300 break-all">{email}</span>
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

          <div className="bg-[#020617] border border-purple-500 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_purple] hover:shadow-[0_0_25px_purple] transition-shadow">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">Total Detections</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-cyan-300 mt-2 sm:mt-3 font-bold">
              {stats.total_detections}
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

        {/* ================= BUTTONS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">

          <button
            onClick={()=>setShowUploadModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-purple-500/20 border border-purple-400
            hover:bg-purple-400 hover:text-black transition shadow-[0_0_15px_purple] hover:shadow-[0_0_25px_purple]
            text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload</span>
          </button>

          <button
            onClick={()=>setShowWebcamModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-cyan-500/20 border border-cyan-400
            hover:bg-cyan-400 hover:text-black transition shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan]
            text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Webcam</span>
          </button>

          <button
            onClick={()=>setShowAnalyticsModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-blue-500/20 border border-blue-400
            hover:bg-blue-400 hover:text-black transition shadow-[0_0_15px_blue] hover:shadow-[0_0_25px_blue]
            text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </button>

          <button
            onClick={()=>setShowLogsModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-yellow-500/20 border border-yellow-400
            hover:bg-yellow-400 hover:text-black transition shadow-[0_0_15px_yellow] hover:shadow-[0_0_25px_yellow]
            text-sm sm:text-base font-medium sm:col-span-2 lg:col-span-1 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View Logs</span>
          </button>

        </div>

      </div>

      {/* ================= MODALS ================= */}
      {showUploadModal && (
        <UploadModal 
          onClose={()=>setShowUploadModal(false)} 
          token={token}
          onSuccess={fetchAdmin}
        />
      )}

      {showWebcamModal && (
        <WebcamModal 
          onClose={()=>setShowWebcamModal(false)} 
          token={token}
          onSuccess={fetchAdmin}
        />
      )}

      {showLogsModal && (
        <LogsModal 
          onClose={()=>setShowLogsModal(false)} 
          logs={logs}
        />
      )}

      {showAnalyticsModal && (
        <AnalyticsModal 
          onClose={()=>setShowAnalyticsModal(false)} 
          token={token}
        />
      )}

    </div>
  )
}

export default AdminDashboard;

// ================= UPLOAD MODAL COMPONENT =================
function UploadModal({ onClose, token, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please select a valid image file (JPG, PNG, or WebP)");
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setFile(null);
      setPreview(null);
      return;
    }

    setError("");
    setResult("");
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const uploadImage = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

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
      const errorMsg = err.response?.data?.message || "Upload failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.5)]">
        
        <div className="sticky top-0 bg-[#0b1120] border-b border-purple-500/30 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-400">🖼️ Upload Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          
          {preview ? (
            <div className="mb-6">
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-black/40">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <button onClick={resetUpload} className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition" disabled={loading}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-400 truncate">{file?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file?.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl cursor-pointer bg-black/20 hover:bg-black/30 transition mb-6">
              <svg className="w-16 h-16 text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-base text-cyan-400 font-medium mb-2">Click to upload image</p>
              <p className="text-sm text-gray-500">JPG, PNG or WebP (Max 10MB)</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
            </label>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-lg border border-red-500/40 bg-red-500/10">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <button onClick={uploadImage} disabled={loading || !file} className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${loading || !file ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg"}`}>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>SCANNING...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>START DETECTION</span>
              </>
            )}
          </button>

          {result && (
            <div className="mt-6 p-6 rounded-xl border-2 bg-black/40 backdrop-blur-sm animate-fadeIn" style={{borderColor: result === "Mask" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", boxShadow: result === "Mask" ? "0 0 20px rgba(34, 197, 94, 0.3)" : "0 0 20px rgba(239, 68, 68, 0.3)"}}>
              <div className="flex items-center justify-center gap-3 mb-3">
                {result === "Mask" ? (
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <p className={`text-3xl font-bold ${result === "Mask" ? "text-green-400" : "text-red-400"}`}>
                  {result === "Mask" ? "😷 MASK DETECTED" : "❌ NO MASK"}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// ================= WEBCAM MODAL =================
function WebcamModal({ onClose, token, onSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setRunning(true);
      setResult("");
      setConfidence(0);

    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera permissions.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.");
      } else {
        setError("Unable to access camera. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setRunning(false);
    setResult("");
    setConfidence(0);
    setError("");
  };

  const sendFrame = async () => {
    if (!running || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL("image/jpeg");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/detect-webcam",
        { image: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.prediction) {
        setResult(res.data.prediction);
        setConfidence(res.data.confidence);
        onSuccess();
      }

    } catch (err) {
      console.error("Frame detection error:", err);
    }
  };

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(sendFrame, 1200);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.5)]">
        
        <div className="sticky top-0 bg-[#0b1120] border-b border-purple-500/30 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">📹 Live Webcam</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          
          <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/50 bg-black mb-6" style={{ aspectRatio: "16/9" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {!running && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-500">
                <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-base">Camera is off</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
                <p className="text-purple-400">Starting camera...</p>
              </div>
            )}

            {running && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/50">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-semibold text-white">LIVE</span>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />

          {error && (
            <div className="mb-6 p-3 rounded-lg border border-red-500/40 bg-red-500/10">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            {!running ? (
              <button onClick={startCamera} disabled={isLoading} className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${isLoading ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg"}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>{isLoading ? "Starting..." : "Start Camera"}</span>
              </button>
            ) : (
              <button onClick={stopCamera} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 transition font-semibold shadow-lg flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span>Stop Camera</span>
              </button>
            )}
          </div>

          {result && running && (
            <div className="p-6 rounded-xl border-2 bg-black/40 animate-fadeIn" style={{borderColor: result === "Mask" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", boxShadow: result === "Mask" ? "0 0 25px rgba(34, 197, 94, 0.4)" : "0 0 25px rgba(239, 68, 68, 0.4)"}}>
              <div className="flex items-center justify-center gap-4 mb-3">
                {result === "Mask" ? (
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <div className={`text-4xl font-bold ${result === "Mask" ? "text-green-400" : "text-red-400"}`}>
                  {result}
                </div>
              </div>
              <div className="text-center text-cyan-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-semibold">Confidence: {confidence}%</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// ================= LOGS MODAL =================
function LogsModal({ onClose, logs }) {

  const [filteredLogs,setFilteredLogs] = useState(logs);
  const [filters,setFilters] = useState({
    status:"all",
    role:"all",
    source:"all",
    search:""
  });

  // pagination
  const [rowsPerPage,setRowsPerPage] = useState(100);
  const [page,setPage] = useState(1);

  // ================= FILTERING =================
  useEffect(()=>{
    let result = [...logs];

    if(filters.status !== "all"){
      result = result.filter(l => l.status === filters.status);
    }

    if(filters.role !== "all"){
      result = result.filter(l => l.role === filters.role);
    }

    if(filters.source !== "all"){
      result = result.filter(l => l.source === filters.source);
    }

    if(filters.search){
      result = result.filter(l =>
        l.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredLogs(result);
    setPage(1);

  },[filters,logs]);

  // ================= PAGINATION =================
  const startIndex = (page-1)*rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentLogs = filteredLogs.slice(startIndex,endIndex);

  const total = filteredLogs.length;

  // ================= UI =================
  return(
    <div className="fixed inset-0 bg-black/40 backdrop-blur z-50 flex items-center justify-center p-4">

      <div className="bg-[#0b1120] border border-purple-500 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b border-purple-500 flex justify-between">
          <h2 className="text-xl font-bold text-yellow-400">📋 Detection Logs</h2>
          <button onClick={onClose}>❌</button>
        </div>

        {/* FILTER BAR */}
        <div className="p-4 border-b border-purple-500 grid grid-cols-1 sm:grid-cols-4 gap-3">

          <input
            placeholder="Search email..."
            className="bg-black border border-purple-500 p-2 rounded"
            value={filters.search}
            onChange={e=>setFilters({...filters,search:e.target.value})}
          />

          <select
            className="bg-black border border-purple-500 p-2 rounded"
            value={filters.status}
            onChange={e=>setFilters({...filters,status:e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="Mask">Mask</option>
            <option value="No Mask">No Mask</option>
          </select>

          <select
            className="bg-black border border-purple-500 p-2 rounded"
            value={filters.role}
            onChange={e=>setFilters({...filters,role:e.target.value})}
          >
            <option value="all">All Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            className="bg-black border border-purple-500 p-2 rounded"
            value={filters.source}
            onChange={e=>setFilters({...filters,source:e.target.value})}
          >
            <option value="all">All Source</option>
            <option value="webcam">Webcam</option>
            <option value="upload">Upload</option>
          </select>

        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">

          <table className="w-full text-sm">
            <thead className="bg-black border-b border-purple-500 text-purple-300 sticky top-0">
              <tr>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Confidence</th>
                <th className="p-3 text-center">Source</th>
                <th className="p-3 text-right">Time</th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    No logs found
                  </td>
                </tr>
              ) : (
                currentLogs.map((log,i)=>(
                  <tr key={i} className="border-b border-purple-900 hover:bg-purple-900/20">
                    <td className="p-3">{log.email}</td>
                    <td className="p-3 text-center">{log.role}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded text-xs font-bold
                        ${log.status==="Mask"
                          ? "bg-green-900 text-green-400"
                          : "bg-red-900 text-red-400"}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">{log.confidence?.toFixed(2)}</td>
                    <td className="p-3 text-center">{log.source}</td>
                    <td className="p-3 text-right text-xs">{log.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-purple-500 flex items-center justify-between">

          {/* left */}
          <div className="flex items-center gap-3">

            <select
              value={rowsPerPage}
              onChange={(e)=>setRowsPerPage(Number(e.target.value))}
              className="bg-black border border-purple-500 px-3 py-2 rounded"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>

            <span className="text-sm text-gray-400">
              {total === 0 ? "0" : `${startIndex+1}-${Math.min(endIndex,total)} of ${total}`}
            </span>
          </div>

          {/* right buttons */}
          <div className="flex gap-2">
            <button
              disabled={page===1}
              onClick={()=>setPage(page-1)}
              className="px-3 py-1 bg-purple-600 rounded disabled:opacity-40"
            >
              Prev
            </button>

            <button
              disabled={endIndex >= total}
              onClick={()=>setPage(page+1)}
              className="px-3 py-1 bg-purple-600 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// ================= ANALYTICS MODAL =================
function AnalyticsModal({ onClose, token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = () => {
      axios.get("http://127.0.0.1:8000/admin/admin-analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setData(res.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load analytics");
      });
    };

    fetchAnalytics();
  }, [token]);

  if (!data && !error) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
        <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-400">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.5)]">
        
        <div className="sticky top-0 bg-[#0b1120] border-b border-purple-500/30 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-400">📊 Analytics Dashboard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          
          {error ? (
            <div className="p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : data && (
            <>
              {/* Detection Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Detection Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard title="Total" value={data.total} color="cyan" />
                  <StatCard title="Mask" value={data.mask} color="green" />
                  <StatCard title="No Mask" value={data.no_mask} color="red" />
                </div>
              </div>

              {/* Source Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Source Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard title="Webcam" value={data.webcam} color="purple" />
                  <StatCard title="Upload" value={data.upload} color="yellow" />
                  <StatCard title="Today" value={data.today} color="pink" />
                </div>
              </div>

              {/* System */}
              {/* System */}
<div>
  <h3 className="text-lg font-semibold text-purple-300 mb-4">System Information</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <StatCard title="System Logs" value={data.system} color="orange" />

    {/* 🔥 ACTIVE USERS CARD */}
    <StatCard 
      title="Active Users" 
      value={data.active_users ?? 0} 
      color="cyan" 
    />
  </div>
</div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    cyan: "border-cyan-500 text-cyan-300",
    green: "border-green-500 text-green-400",
    red: "border-red-500 text-red-400",
    purple: "border-purple-500 text-purple-400",
    yellow: "border-yellow-500 text-yellow-400",
    pink: "border-pink-500 text-pink-400",
    orange: "border-orange-500 text-orange-400"
  };

  return (
    <div className={`bg-[#020617] border ${colors[color]} rounded-xl p-6 text-center`}>
      <h4 className="text-sm text-gray-400 mb-2">{title}</h4>
      <p className={`text-4xl font-bold ${colors[color]}`}>{value !== undefined ? value : "0"}</p>
    </div>
  );
}
