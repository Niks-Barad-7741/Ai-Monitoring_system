// import { useRef, useEffect, useState } from "react";
// import axios from "axios";

// function WebcamDetect(){

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);     // hidden capture canvas
//   const overlayRef = useRef(null);    // 🔥 bounding box overlay

//   const [running,setRunning] = useState(false);
//   const [result,setResult] = useState("");
//   const [confidence,setConfidence] = useState(0);

//   const token = sessionStorage.getItem("token");

//   // ===============================
//   // 🎥 START CAMERA
//   // ===============================
//   const startCamera = async ()=>{
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({video:true});
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       setRunning(true);
//       setResult(""); // reset result
//     } catch (err) {
//       alert("Camera access denied");
//     }
//   };

//   // ===============================
//   // 🛑 STOP CAMERA (FIXED)
//   // ===============================
//   const stopCamera = ()=>{
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       stream.getTracks().forEach(track => track.stop()); // Stop stream
//       videoRef.current.srcObject = null; // 🔥 CLEAR FRAME (Black Screen)
//     }
    
//     // Clear overlay
//     if(overlayRef.current){
//         const ctx = overlayRef.current.getContext("2d");
//         ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
//     }

//     setRunning(false);
//     setResult("");
//     setConfidence(0);
//   };

//   // ===============================
//   // 🎯 DRAW BOUNDING BOX
//   // ===============================
//   const drawBox = (prediction)=>{

//     const canvas = overlayRef.current;
//     const video = videoRef.current;

//     if(!canvas || !video) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0,0,canvas.width,canvas.height);

//     // Only draw if we have a valid prediction
//     if (!prediction) return;

//     // 🔥 random box (for visual demo)
//     const boxWidth = canvas.width * 0.45;
//     const boxHeight = canvas.height * 0.6;
//     const x = canvas.width * 0.28;
//     const y = canvas.height * 0.18;

//     ctx.lineWidth = 4;

//     if(prediction === "Mask"){
//       ctx.strokeStyle = "#00ff88"; // green neon
//       ctx.shadowColor = "#00ff88";
//     } else {
//       ctx.strokeStyle = "#ff0040"; // red neon
//       ctx.shadowColor = "#ff0040";
//     }

//     ctx.shadowBlur = 25;
//     ctx.strokeRect(x,y,boxWidth,boxHeight);
//   };

//   // ===============================
//   // 📡 SEND FRAME TO BACKEND
//   // ===============================
//   const sendFrame = async ()=>{

//     if(!running || !videoRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // Ensure video is actually playing
//     if (video.videoWidth === 0 || video.videoHeight === 0) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     ctx.drawImage(video,0,0,canvas.width,canvas.height);
//     const base64Image = canvas.toDataURL("image/jpeg");

//     try{
//       const res = await axios.post(
//         "http://127.0.0.1:8000/ai/detect-webcam",
//         {image:base64Image},
//         { headers:{Authorization:`Bearer ${token}`} }
//       );

//       // Debugging
//       console.log("Backend Response:", res.data);

//       if(res.data.prediction){
//           setResult(res.data.prediction);
//           setConfidence(res.data.confidence);
//           drawBox(res.data.prediction);
//       }

//     }catch(err){
//       console.log("Frame error", err);
//     }
//   };

//   // ===============================
//   // 🔁 LOOP EVERY 1.2s
//   // ===============================
//   useEffect(()=>{
//     let interval;
//     if(running){
//       interval = setInterval(sendFrame, 1200);
//     }
//     return ()=> clearInterval(interval);
//   },[running]);

//   // ===============================
//   // UI
//   // ===============================
//   return(
//     <div className="min-h-screen bg-gradient-to-br from-black via-[#050816] to-[#020617] text-white flex items-center justify-center p-4">

//       <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.4)] text-center">

//         <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
//           LIVE AI MONITOR
//         </h1>

//         <p className="text-gray-400 mb-6 text-sm md:text-base">
//           Real-time face mask detection system
//         </p>

//         {/* VIDEO CONTAINER */}
//         <div className="relative flex justify-center bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.6)] max-w-2xl mx-auto border-2 border-purple-500">
          
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full h-full object-cover"
//             style={{ minHeight: "300px" }} 
//           />

//           <canvas
//             ref={overlayRef}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//           />

//         </div>

//         <canvas ref={canvasRef} style={{display:"none"}} />

//         {/* BUTTONS */}
//         <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">

//           {!running ? (
//             <button
//               onClick={startCamera}
//               className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition font-semibold shadow-lg"
//             >
//               ▶ Start Camera
//             </button>
//           ):(
//             <button
//               onClick={stopCamera}
//               className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 transition font-semibold shadow-lg"
//             >
//               ■ Stop Camera
//             </button>
//           )}

//           <button
//             onClick={()=>window.history.back()}
//             className="px-8 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 transition"
//           >
//             ← Dashboard
//           </button>

//         </div>

//         {/* RESULT HUD */}
//         {result && (
//           <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-cyan-500 shadow-[0_0_25px_cyan]">

//             <div className="text-gray-400 text-sm">AI STATUS</div>

//             <div className={`text-4xl md:text-5xl font-bold mt-2 ${
//               result==="Mask" ? "text-green-400" : "text-red-500"
//             }`}>
//               {result}
//             </div>

//             <div className="text-cyan-300 mt-2">
//               Confidence: {confidence}%
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   )
// }

// export default WebcamDetect;
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function WebcamDetect(){

  const videoRef = useRef(null);
  const canvasRef = useRef(null);     // hidden capture canvas
  const overlayRef = useRef(null);    // bounding box overlay

  const [running,setRunning] = useState(false);
  const [result,setResult] = useState("");
  const [confidence,setConfidence] = useState(0);
  const [cameraError,setCameraError] = useState("");
  const [isLoading,setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // ===============================
  // 🎥 START CAMERA
  // ===============================
  const startCamera = async ()=>{
    setIsLoading(true);
    setCameraError("");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setRunning(true);
      setResult("");
      setConfidence(0);
      
    } catch (err) {
      console.error("Camera error:", err);
      
      if (err.name === 'NotAllowedError') {
        setCameraError("Camera access denied. Please allow camera permissions.");
      } else if (err.name === 'NotFoundError') {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError("Unable to access camera. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // 🛑 STOP CAMERA
  // ===============================
  const stopCamera = ()=>{
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Clear overlay
    if(overlayRef.current){
      const ctx = overlayRef.current.getContext("2d");
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }

    setRunning(false);
    setResult("");
    setConfidence(0);
    setCameraError("");
  };

  // ===============================
  // 🎯 DRAW BOUNDING BOX
  // ===============================
  const drawBox = (prediction)=>{

    const canvas = overlayRef.current;
    const video = videoRef.current;

    if(!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (!prediction) return;

    // Bounding box dimensions
    const boxWidth = canvas.width * 0.45;
    const boxHeight = canvas.height * 0.6;
    const x = canvas.width * 0.28;
    const y = canvas.height * 0.18;

    ctx.lineWidth = 4;

    if(prediction === "Mask"){
      ctx.strokeStyle = "#00ff88"; // green neon
      ctx.shadowColor = "#00ff88";
    } else {
      ctx.strokeStyle = "#ff0040"; // red neon
      ctx.shadowColor = "#ff0040";
    }

    ctx.shadowBlur = 25;
    ctx.strokeRect(x,y,boxWidth,boxHeight);
  };

  // ===============================
  // 📡 SEND FRAME TO BACKEND
  // ===============================
  const sendFrame = async ()=>{

    if(!running || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ensure video is actually playing
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    const base64Image = canvas.toDataURL("image/jpeg");

    try{
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/detect-webcam",
        {image:base64Image},
        { headers:{Authorization:`Bearer ${token}`} }
      );

      if(res.data.prediction){
        setResult(res.data.prediction);
        setConfidence(res.data.confidence);
        drawBox(res.data.prediction);
      }

    }catch(err){
      console.error("Frame detection error:", err);
    }
  };

  // ===============================
  // 🔁 LOOP EVERY 1.2s
  // ===============================
  useEffect(()=>{
    let interval;
    if(running){
      interval = setInterval(sendFrame, 1200);
    }
    return ()=> clearInterval(interval);
  },[running]);

  // Cleanup on unmount
  useEffect(()=>{
    return ()=> stopCamera();
  },[]);

  // ===============================
  // UI
  // ===============================
  return(
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050816] to-[#020617] text-white 
    flex items-center justify-center 
    px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-5xl 
      bg-white/5 backdrop-blur-xl 
      border border-purple-500/30 
      rounded-2xl sm:rounded-3xl 
      p-4 sm:p-6 lg:p-8 
      shadow-[0_0_40px_rgba(168,85,247,0.3)] sm:shadow-[0_0_60px_rgba(168,85,247,0.4)]">

        {/* TITLE */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
          font-bold mb-2 sm:mb-3
          bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 
          bg-clip-text text-transparent
          drop-shadow-lg">
            LIVE AI MONITOR
          </h1>

          <p className="text-gray-400 text-xs sm:text-sm md:text-base px-2">
            Real-time face mask detection system
          </p>
        </div>

        {/* VIDEO CONTAINER */}
        <div className="relative flex justify-center 
        bg-black rounded-xl sm:rounded-2xl overflow-hidden 
        shadow-[0_0_30px_rgba(168,85,247,0.5)] sm:shadow-[0_0_40px_rgba(168,85,247,0.6)]
        max-w-3xl mx-auto 
        border-2 border-purple-500/50
        mb-6 sm:mb-8">
          
          {/* Video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ 
              minHeight: "250px",
              maxHeight: "500px",
              aspectRatio: "16/9"
            }} 
          />

          {/* Overlay canvas for bounding box */}
          <canvas
            ref={overlayRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {/* Camera off placeholder */}
          {!running && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center 
            bg-gradient-to-br from-gray-900 to-black text-gray-500">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-4 opacity-50" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm sm:text-base">Camera is off</p>
              <p className="text-xs sm:text-sm mt-2 opacity-75">Click "Start Camera" to begin</p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center 
            bg-black/80 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 
              border-b-2 border-purple-400 mb-4"></div>
              <p className="text-sm sm:text-base text-purple-400">Starting camera...</p>
            </div>
          )}

          {/* Live indicator */}
          {running && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 
            flex items-center gap-2 
            bg-black/60 backdrop-blur-sm 
            px-3 py-1.5 sm:px-4 sm:py-2 
            rounded-full border border-red-500/50">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white">LIVE</span>
            </div>
          )}

        </div>

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} style={{display:"none"}} />

        {/* ERROR MESSAGE */}
        {cameraError && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 
          rounded-lg border border-red-500/40 
          bg-red-500/10">
            <p className="text-xs sm:text-sm text-red-400 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{cameraError}</span>
            </p>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">

          {!running ? (
            <button
              onClick={startCamera}
              disabled={isLoading}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 
              rounded-xl font-semibold 
              text-sm sm:text-base
              transition-all duration-300
              flex items-center justify-center gap-2
              ${isLoading 
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              }`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>{isLoading ? "Starting..." : "Start Camera"}</span>
            </button>
          ):(
            <button
              onClick={stopCamera}
              className="px-6 sm:px-8 py-2.5 sm:py-3 
              rounded-xl 
              bg-gradient-to-r from-red-500 to-pink-600 
              hover:from-red-400 hover:to-pink-500
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-300
              font-semibold shadow-lg hover:shadow-xl
              text-sm sm:text-base
              flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              <span>Stop Camera</span>
            </button>
          )}

          <button
            onClick={()=>navigate(-1)}
            className="px-6 sm:px-8 py-2.5 sm:py-3 
            rounded-xl 
            bg-gradient-to-r from-gray-700 to-gray-900 
            hover:from-gray-600 hover:to-gray-800
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300
            text-sm sm:text-base
            flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Dashboard</span>
          </button>

        </div>

        {/* RESULT HUD */}
        {result && running && (
          <div className="p-4 sm:p-6 lg:p-8
          rounded-xl sm:rounded-2xl 
          bg-black/40 backdrop-blur-sm
          border-2 transition-all duration-300
          animate-fadeIn"
          style={{
            borderColor: result === "Mask" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
            boxShadow: result === "Mask" 
              ? "0 0 25px rgba(34, 197, 94, 0.4)" 
              : "0 0 25px rgba(239, 68, 68, 0.4)"
          }}>

            {/* Status Label */}
            <div className="text-gray-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3 uppercase tracking-wider">
              AI Detection Status
            </div>

            {/* Result with Icon */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              {result === "Mask" ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 
                rounded-full bg-green-500/20 
                flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 
                rounded-full bg-red-500/20 
                flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}

              <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
              font-bold 
              ${result === "Mask" ? "text-green-400" : "text-red-500"}`}>
                {result}
              </div>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-center gap-2 text-cyan-300">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm sm:text-base lg:text-lg font-semibold">
                Confidence: {confidence}%
              </span>
            </div>

          </div>
        )}

        {/* INFO FOOTER */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Detection updates every 1.2 seconds
          </p>
        </div>

      </div>
    </div>
  )
}

export default WebcamDetect;