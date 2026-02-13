import { useRef, useEffect, useState } from "react";
import axios from "axios";

function WebcamDetect(){

  const videoRef = useRef(null);
  const canvasRef = useRef(null);     // hidden capture canvas
  const overlayRef = useRef(null);    // 🔥 bounding box overlay

  const [running,setRunning] = useState(false);
  const [result,setResult] = useState("");
  const [confidence,setConfidence] = useState(0);

  const token = sessionStorage.getItem("token");

  // ===============================
  // 🎥 START CAMERA
  // ===============================
  const startCamera = async ()=>{
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:true});
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setRunning(true);
      setResult(""); // reset result
    } catch (err) {
      alert("Camera access denied");
    }
  };

  // ===============================
  // 🛑 STOP CAMERA (FIXED)
  // ===============================
  const stopCamera = ()=>{
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop()); // Stop stream
      videoRef.current.srcObject = null; // 🔥 CLEAR FRAME (Black Screen)
    }
    
    // Clear overlay
    if(overlayRef.current){
        const ctx = overlayRef.current.getContext("2d");
        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }

    setRunning(false);
    setResult("");
    setConfidence(0);
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

    // Only draw if we have a valid prediction
    if (!prediction) return;

    // 🔥 random box (for visual demo)
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

      // Debugging
      console.log("Backend Response:", res.data);

      if(res.data.prediction){
          setResult(res.data.prediction);
          setConfidence(res.data.confidence);
          drawBox(res.data.prediction);
      }

    }catch(err){
      console.log("Frame error", err);
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

  // ===============================
  // UI
  // ===============================
  return(
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050816] to-[#020617] text-white flex items-center justify-center p-4">

      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.4)] text-center">

        <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          LIVE AI MONITOR
        </h1>

        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Real-time face mask detection system
        </p>

        {/* VIDEO CONTAINER */}
        <div className="relative flex justify-center bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.6)] max-w-2xl mx-auto border-2 border-purple-500">
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ minHeight: "300px" }} 
          />

          <canvas
            ref={overlayRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

        </div>

        <canvas ref={canvasRef} style={{display:"none"}} />

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">

          {!running ? (
            <button
              onClick={startCamera}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition font-semibold shadow-lg"
            >
              ▶ Start Camera
            </button>
          ):(
            <button
              onClick={stopCamera}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 transition font-semibold shadow-lg"
            >
              ■ Stop Camera
            </button>
          )}

          <button
            onClick={()=>window.history.back()}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 transition"
          >
            ← Dashboard
          </button>

        </div>

        {/* RESULT HUD */}
        {result && (
          <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-cyan-500 shadow-[0_0_25px_cyan]">

            <div className="text-gray-400 text-sm">AI STATUS</div>

            <div className={`text-4xl md:text-5xl font-bold mt-2 ${
              result==="Mask" ? "text-green-400" : "text-red-500"
            }`}>
              {result}
            </div>

            <div className="text-cyan-300 mt-2">
              Confidence: {confidence}%
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default WebcamDetect;