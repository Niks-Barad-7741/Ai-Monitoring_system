// import { useRef, useEffect, useState } from "react";
// import axios from "axios";

// function WebcamDetect(){

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const [running,setRunning] = useState(false);
//   const [result,setResult] = useState("");

//   const token = sessionStorage.getItem("token");

//   // ===============================
//   // 🎥 START CAMERA
//   // ===============================
//   const startCamera = async ()=>{
//     const stream = await navigator.mediaDevices.getUserMedia({video:true});
//     videoRef.current.srcObject = stream;
//     setRunning(true);
//   };

//   // ===============================
//   // 🛑 STOP CAMERA
//   // ===============================
//   const stopCamera = ()=>{
//     const stream = videoRef.current.srcObject;
//     const tracks = stream.getTracks();
//     tracks.forEach(track=>track.stop());
//     setRunning(false);
//   };

//   // ===============================
//   // 📡 SEND FRAME
//   // ===============================
//   const sendFrame = async ()=>{

//     if(!running) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

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

//       setResult(res.data.prediction);

//     }catch(err){
//       console.log("Frame error");
//     }
//   };

//   // ===============================
//   // 🔁 LOOP
//   // ===============================
//   useEffect(()=>{
//     let interval;
//     if(running){
//       interval = setInterval(sendFrame,1500);
//     }
//     return ()=> clearInterval(interval);
//   },[running]);

//   // ===============================
//   // UI
//   // ===============================
//   return(
//     <div className="min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0d1326] to-black text-white flex flex-col items-center justify-center p-6">

//       {/* CARD */}
//       <div className="backdrop-blur-lg bg-white/5 border border-purple-500/30 shadow-2xl rounded-3xl p-8 w-[95%] max-w-3xl text-center">

//         <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//           🎥 Live AI Detection
//         </h1>

//         <p className="text-gray-400 mb-6">
//           Real-time mask detection via webcam
//         </p>

//         {/* VIDEO */}
//         <div className="flex justify-center">
//           <video
//             ref={videoRef}
//             autoPlay
//             className="rounded-xl border-2 border-purple-500 shadow-lg shadow-purple-500/20"
//             width="520"
//           />
//         </div>

//         <canvas ref={canvasRef} style={{display:"none"}} />

//         {/* BUTTONS */}
//         <div className="flex justify-center gap-6 mt-6">

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

//         </div>

//         {/* RESULT */}
//         {result && (
//           <div className="mt-8">
//             <div className="text-lg text-gray-400">AI Result</div>

//             <div className={`text-4xl font-bold mt-2 ${
//               result === "Mask"
//               ? "text-green-400"
//               : "text-red-400"
//             }`}>
//               {result}
//             </div>
//           </div>
//         )}

//         {/* BACK */}
//         <button
//           onClick={()=>window.history.back()}
//           className="mt-8 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition"
//         >
//           ← Back Dashboard
//         </button>

//       </div>
//     </div>
//   )
// }

// export default WebcamDetect;
import { useRef, useEffect, useState } from "react";
import axios from "axios";

function WebcamDetect(){

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [running,setRunning] = useState(false);
  const [result,setResult] = useState("");

  const token = sessionStorage.getItem("token");

  // ===============================
  // 🎥 START CAMERA
  // ===============================
  const startCamera = async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    videoRef.current.srcObject = stream;
    setRunning(true);
  };

  // ===============================
  // 🛑 STOP CAMERA
  // ===============================
  const stopCamera = ()=>{
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track=>track.stop());
    setRunning(false);
  };

  // ===============================
  // 📡 SEND FRAME
  // ===============================
  const sendFrame = async ()=>{

    if(!running) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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

      setResult(res.data.prediction);

    }catch(err){
      console.log("Frame error");
    }
  };

  // ===============================
  // 🔁 LOOP
  // ===============================
  useEffect(()=>{
    let interval;
    if(running){
      interval = setInterval(sendFrame,1500);
    }
    return ()=> clearInterval(interval);
  },[running]);

  // ===============================
  // UI
  // ===============================
  return(
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0d1326] to-black text-white flex flex-col items-center justify-center p-6">

      {/* CARD */}
      <div className="backdrop-blur-lg bg-white/5 border border-purple-500/30 shadow-2xl rounded-3xl p-8 w-[95%] max-w-3xl text-center">

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          🎥 Live AI Detection
        </h1>

        <p className="text-gray-400 mb-6">
          Real-time mask detection via webcam
        </p>

        {/* VIDEO */}
        <div className="flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            className="rounded-xl border-2 border-purple-500 shadow-lg shadow-purple-500/20"
            width="520"
          />
        </div>

        <canvas ref={canvasRef} style={{display:"none"}} />

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 mt-6">

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

        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-8">
            <div className="text-lg text-gray-400">AI Result</div>

            <div className={`text-4xl font-bold mt-2 ${
              result === "Mask"
              ? "text-green-400"
              : "text-red-400"
            }`}>
              {result}
            </div>
          </div>
        )}

        {/* BACK */}
        <button
          onClick={()=>window.history.back()}
          className="mt-8 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition"
        >
          ← Back Dashboard
        </button>

      </div>
    </div>
  )
}

export default WebcamDetect;