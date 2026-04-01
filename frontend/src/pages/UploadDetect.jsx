import { useState } from "react";
import axios from "axios";

function UploadDetect(){

  const [file,setFile] = useState(null);
  const [preview,setPreview] = useState(null);
  const [result,setResult] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const token = sessionStorage.getItem("token");

  // Handle file selection with validation and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if(!selectedFile){
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if(!validTypes.includes(selectedFile.type)){
      setError("Please select a valid image file (JPG, PNG, or WebP)");
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file size (max 10MB)
    if(selectedFile.size > 10 * 1024 * 1024){
      setError("File size must be less than 10MB");
      setFile(null);
      setPreview(null);
      return;
    }

    // Clear previous error and result
    setError("");
    setResult("");
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Upload and detect
  const uploadImage = async ()=>{

    if(!file){
      setError("Please select an image first");
      return;
    }

    if(loading) return;
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file",file);

    try{
      const res = await axios.post(
        "/ai/detect-image",
        formData,
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      setResult(res.data.prediction);

    }catch(err){
      const errorMsg = err.response?.data?.message || "Upload failed. Please try again.";
      setError(errorMsg);
    }finally{
      setLoading(false);
    }
  };

  // Clear/Reset
  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setError("");
  };

  return(
    <div className="min-h-screen bg-[#1e1e2e] 
    flex flex-col items-center justify-center 
    px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
        font-bold mb-6 sm:mb-8 lg:mb-10
        text-[#97C9DB] tracking-wide sm:tracking-widest 
        text-center">
          AI IMAGE SCANNER
        </h1>

        {/* MAIN CARD */}
        <div className="
          bg-[#282828] backdrop-blur-lg
          border border-[#97C9DB]/30 
          shadow-[0_0_30px_rgba(6,182,212,0.3)]
          hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]
          p-6 sm:p-8 lg:p-10
          rounded-2xl 
          transition-all duration-300
        ">

          {/* IMAGE PREVIEW SECTION */}
          {preview ? (
            <div className="mb-6 sm:mb-8">
              <div className="relative aspect-video sm:aspect-square lg:aspect-video 
              rounded-xl overflow-hidden border-2 border-[#97C9DB]/30
              bg-black/40">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
                
                {/* Remove button */}
                <button
                  onClick={resetUpload}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3
                  bg-[#FFB7B2]/90 hover:bg-[#FFB7B2] text-[#1e1e2e]
                  text-white rounded-full p-2 sm:p-2.5
                  transition-all duration-200
                  shadow-lg hover:shadow-xl"
                  disabled={loading}
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* File info */}
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-400 truncate px-2">
                   {file?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file?.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ) : (
            /* FILE UPLOAD SECTION */
            <div className="mb-6 sm:mb-8">
              <label 
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center
                aspect-video sm:aspect-square lg:aspect-video
                border-2 border-dashed border-[#97C9DB]/30
                hover:border-[#97C9DB]
                rounded-xl cursor-pointer
                bg-black/20 hover:bg-black/30
                transition-all duration-300
                group"
              >
                {/* Upload Icon */}
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 
                    text-[#97C9DB] group-hover:text-[#97C9DB] 
                    transition-colors mb-3 sm:mb-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                  
                  <p className="text-sm sm:text-base lg:text-lg text-[#97C9DB] font-medium mb-1 sm:mb-2">
                    Click to upload image
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 px-4 text-center">
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-2 sm:mt-3">
                    JPG, PNG or WebP (Max 10MB)
                  </p>
                </div>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 
            rounded-lg border border-[#FFB7B2]/30 
            bg-[#FFB7B2]/10 animate-shake">
              <p className="text-xs sm:text-sm text-[#FFB7B2] text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* SCAN BUTTON */}
          <button
            onClick={uploadImage}
            disabled={loading || !file}
            className={`
              w-full py-3 sm:py-3.5 lg:py-4
              rounded-xl font-semibold tracking-wide sm:tracking-wider 
              transition-all duration-300 
              text-sm sm:text-base lg:text-lg
              flex items-center justify-center gap-2 sm:gap-3
              ${loading || !file
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-[#97C9DB] text-[#1e1e2e] hover:bg-[#85bdd2] transition font-semibold shadow-lg"
              }
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

          {/* RESULT */}
          {result && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 
            rounded-xl border-2 
            bg-black/40 backdrop-blur-sm
            animate-fadeIn
            transition-all duration-300"
            style={{
              borderColor: result === "Mask" ? "#B5EAD7" : "#FFB7B2",
              boxShadow: "none"
            }}>
              
              {/* Result Icon */}
              <div className="flex justify-center mb-3 sm:mb-4">
                {result === "Mask" ? (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#B5EAD7]/20 
                  flex items-center justify-center animate-bounce">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#B5EAD7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FFB7B2]/20 
                  flex items-center justify-center animate-bounce">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFB7B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Result Text */}
              <h2 className="text-base sm:text-lg lg:text-xl text-center text-gray-300 mb-2">
                Detection Result
              </h2>
              <p className="text-center">
                <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                  result === "Mask" ? "text-[#B5EAD7]" : "text-[#FFB7B2]"
                }`}>
                  {result === "Mask" ? " MASK DETECTED" : " NO MASK"}
                </span>
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            
            {/* Back Button */}
            <button
              onClick={()=>window.history.back()}
              className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6
              text-xs sm:text-sm font-medium
              text-gray-400 hover:text-gray-300
              border border-gray-600 hover:border-gray-500
              rounded-lg transition-all duration-200
              flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>

            {/* Upload Another */}
            {(file || result) && (
              <button
                onClick={resetUpload}
                className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6
                text-xs sm:text-sm font-medium
                text-[#97C9DB] hover:text-[#97C9DB]
                border border-[#97C9DB] hover:border-[#97C9DB]
                rounded-lg transition-all duration-200
                flex items-center justify-center gap-2"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Upload Another</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default UploadDetect;