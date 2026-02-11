import { useState } from "react";
import axios from "axios";

function UploadDetect(){

  const [file,setFile] = useState(null);
  const [result,setResult] = useState("");
  const token = sessionStorage.getItem("token");

  const uploadImage = async ()=>{

    const formData = new FormData();
    formData.append("file",file);

    try{
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/detect-image",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setResult(res.data.prediction);

    }catch(err){
      alert("Upload failed");
    }
  }

  return(
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center">

      <h1 className="text-3xl mb-6">📤 Upload Detection</h1>

      <input type="file" onChange={(e)=>setFile(e.target.files[0])}
        className="mb-4" />

      <button onClick={uploadImage} className="bg-green-600 px-6 py-2 rounded">
        Detect
      </button>

      {result && (
        <h2 className="mt-6 text-2xl">Result: {result}</h2>
      )}

      <button
        onClick={()=>window.history.back()}
        className="mt-6 bg-red-600 px-4 py-2 rounded"
      >
        Back
      </button>

    </div>
  )
}

export default UploadDetect;
