function WebcamDetect(){
  return(
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center">

      <h1 className="text-3xl mb-6">🎥 Webcam Detection</h1>

      <p>Webcam detection backend already ready.</p>
      <p>We will connect live feed next.</p>

      <button
        onClick={()=>window.history.back()}
        className="mt-6 bg-red-600 px-4 py-2 rounded"
      >
        Back
      </button>

    </div>
  )
}

export default WebcamDetect;
