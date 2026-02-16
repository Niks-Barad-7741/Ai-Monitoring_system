import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminAnalytics(){
  const [data,setData] = useState(null);
  const [error,setError] = useState("");
  const navigate = useNavigate();
  
  const token = sessionStorage.getItem("token");

  const fetchAnalytics = ()=>{
    axios.get("http://127.0.0.1:8000/admin/admin-analytics",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      setData(res.data);
      setError("");
    })
    .catch((err)=>{
      console.error("Analytics fetch error:", err);
      setError("Failed to load analytics");
      alert("Session expired");
      sessionStorage.clear();
      navigate("/");
    });
  };

  useEffect(()=>{
    fetchAnalytics();
  },[]);

  if(!data && !error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-purple-400">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-base sm:text-xl">Loading Analytics...</p>
      </div>
    </div>
  );

  return(
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
          font-bold text-purple-400 tracking-wide sm:tracking-widest 
          drop-shadow-[0_0_15px_purple] mb-3 sm:mb-4">
             ADMIN ANALYTICS
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Complete system detection insights
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 sm:mb-8 p-4 rounded-lg border border-red-500/40 bg-red-500/10 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-red-400 text-center">{error}</p>
          </div>
        )}

        {data && (
          <>
            {/* MAIN STATS */}
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-purple-300 mb-4 sm:mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Detection Overview</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card title="Total Detections" value={data.total} color="cyan" icon="total"/>
                <Card title="Mask Detected" value={data.mask} color="green" icon="mask"/>
                <Card title="No Mask" value={data.no_mask} color="red" icon="nomask"/>
              </div>
            </div>

            {/* SOURCE STATS */}
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-purple-300 mb-4 sm:mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <span>Source Breakdown</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card title="Webcam Detections" value={data.webcam} color="purple" icon="webcam"/>
                <Card title="Upload Detections" value={data.upload} color="yellow" icon="upload"/>
                <Card title="Today's Detections" value={data.today} color="pink" icon="calendar"/>
              </div>
            </div>

            {/* SYSTEM INFO */}
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-purple-300 mb-4 sm:mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>System Information</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <Card title="System Logs" value={data.system} color="orange" icon="logs"/>
                <Card title="Active Users" value={data.active_users || "N/A"} color="blue" icon="users"/>
              </div>
            </div>
          </>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
          <button
            onClick={()=>navigate("/admin")}
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 
            bg-purple-600 rounded-lg hover:bg-purple-700 
            transition-all duration-300 shadow-lg hover:shadow-xl
            text-sm sm:text-base font-medium
            flex items-center justify-center gap-2
            hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={fetchAnalytics}
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 
            bg-cyan-600 rounded-lg hover:bg-cyan-700 
            transition-all duration-300 shadow-lg hover:shadow-xl
            text-sm sm:text-base font-medium
            flex items-center justify-center gap-2
            hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Data</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;

// ================= CARD COMPONENT =================
function Card({title, value, color, icon}){
  const colors = {
    cyan: {
      border: "border-cyan-500",
      shadow: "shadow-[0_0_15px_cyan]",
      hoverShadow: "hover:shadow-[0_0_25px_cyan]",
      text: "text-cyan-300"
    },
    green: {
      border: "border-green-500",
      shadow: "shadow-[0_0_15px_green]",
      hoverShadow: "hover:shadow-[0_0_25px_green]",
      text: "text-green-400"
    },
    red: {
      border: "border-red-500",
      shadow: "shadow-[0_0_15px_red]",
      hoverShadow: "hover:shadow-[0_0_25px_red]",
      text: "text-red-400"
    },
    purple: {
      border: "border-purple-500",
      shadow: "shadow-[0_0_15px_purple]",
      hoverShadow: "hover:shadow-[0_0_25px_purple]",
      text: "text-purple-400"
    },
    yellow: {
      border: "border-yellow-500",
      shadow: "shadow-[0_0_15px_yellow]",
      hoverShadow: "hover:shadow-[0_0_25px_yellow]",
      text: "text-yellow-400"
    },
    pink: {
      border: "border-pink-500",
      shadow: "shadow-[0_0_15px_pink]",
      hoverShadow: "hover:shadow-[0_0_25px_pink]",
      text: "text-pink-400"
    },
    orange: {
      border: "border-orange-500",
      shadow: "shadow-[0_0_15px_orange]",
      hoverShadow: "hover:shadow-[0_0_25px_orange]",
      text: "text-orange-400"
    },
    blue: {
      border: "border-blue-500",
      shadow: "shadow-[0_0_15px_blue]",
      hoverShadow: "hover:shadow-[0_0_25px_blue]",
      text: "text-blue-400"
    }
  };

  const icons = {
    total: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    mask: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    nomask: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    webcam: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    upload: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    logs: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  };

  const colorClasses = colors[color] || colors.cyan;

  return(
    <div className={`bg-[#020617] border ${colorClasses.border} ${colorClasses.shadow} ${colorClasses.hoverShadow}
    rounded-xl p-5 sm:p-6 lg:p-8 text-center 
    transition-all duration-300 hover:scale-[1.02]`}>
      
      {/* Icon */}
      <div className={`flex justify-center mb-3 sm:mb-4 ${colorClasses.text}`}>
        {icons[icon] || icons.total}
      </div>

      {/* Title */}
      <h2 className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 font-medium uppercase tracking-wider">
        {title}
      </h2>

      {/* Value */}
      <p className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${colorClasses.text}`}>
        {value !== undefined && value !== null ? value : "0"}
      </p>
    </div>
  );
}