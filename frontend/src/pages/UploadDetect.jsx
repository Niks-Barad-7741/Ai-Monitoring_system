import { useState } from "react";
import axios from "axios";

function UploadDetect(){

  const [file,setFile] = useState(null);
  const [result,setResult] = useState("");
  const [loading,setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  const uploadImage = async ()=>{

    if(!file){
      alert("Select image first");
      return;
    }

    if(loading) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file",file);

    try{
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/detect-image",
        formData,
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      setResult(res.data.prediction);

    }catch(err){
      alert("Upload failed");
    }

    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-[#020617] text-cyan-400 flex flex-col items-center justify-center">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8 text-cyan-400 tracking-widest">
        AI IMAGE SCANNER
      </h1>

      {/* MAIN CARD */}
      <div className="bg-[#0b1120] border border-cyan-500/40 shadow-[0_0_30px_#06b6d4] p-10 rounded-2xl w-[420px] text-center">

        {/* FILE INPUT */}
        <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
          className="mb-6 w-full text-sm file:bg-cyan-600 file:border-none file:px-4 file:py-2 file:rounded file:text-white file:cursor-pointer"
        />

        {/* BUTTON */}
        <button
          onClick={uploadImage}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold tracking-wider transition-all duration-300 ${
            loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_#06b6d4]"
          }`}
        >
          {loading ? "SCANNING..." : "START DETECTION"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-8 p-4 rounded-xl border border-cyan-500 bg-black/40">
            <h2 className="text-xl">
              RESULT :
              <span className={`ml-2 font-bold ${
                result === "Mask" ? "text-green-400" : "text-red-400"
              }`}>
                {result}
              </span>
            </h2>
          </div>
        )}

        {/* BACK */}
        <button
          onClick={()=>window.history.back()}
          className="mt-6 text-sm text-red-400 hover:text-red-300 underline"
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  )
}

export default UploadDetect;