import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

function AdminDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);
  const [showLogs,setShowLogs] = useState(false);
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

  const logout = ()=>{
    sessionStorage.clear();
    navigate("/");
  }

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
          
          {/* Mobile & Tablet: Stack layout */}
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            
            {/* Title - centered on mobile, left-aligned on desktop */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest text-purple-400 drop-shadow-[0_0_15px_purple]">
                Admin Control Panel
              </h1>

              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-400 px-2 sm:px-0">
                Logged in as <span className="text-purple-300 break-all">{email}</span>
              </p>
            </div>

            {/* Logout Button */}
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

          {/* Total Detections Card */}
          <div className="bg-[#020617] border border-purple-500 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_purple] hover:shadow-[0_0_25px_purple] transition-shadow">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">Total Detections</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-cyan-300 mt-2 sm:mt-3 font-bold">
              {stats.total_detections}
            </p>
          </div>

          {/* Mask Detected Card */}
          <div className="bg-[#020617] border border-green-400 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_green] hover:shadow-[0_0_25px_green] transition-shadow">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">Mask Detected</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-green-400 mt-2 sm:mt-3 font-bold">
              {stats.mask_detected}
            </p>
          </div>

          {/* No Mask Card - full width on mobile with 2 columns */}
          <div className="bg-[#020617] border border-red-500 rounded-xl p-5 sm:p-6 lg:p-8 text-center shadow-[0_0_15px_red] hover:shadow-[0_0_25px_red] transition-shadow sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm sm:text-base text-gray-400 font-medium">No Mask Detected</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl text-red-400 mt-2 sm:mt-3 font-bold">
              {stats.no_mask_detected}
            </p>
          </div>

        </div>

        {/* ================= BUTTONS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">

          <button
            onClick={()=>window.location="/upload"}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-purple-500/20 border border-purple-400
            hover:bg-purple-400 hover:text-black transition shadow-[0_0_15px_purple] hover:shadow-[0_0_25px_purple]
            text-sm sm:text-base font-medium"
          >
             Upload Detection
          </button>

          <button
            onClick={()=>window.location="/webcam"}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-cyan-500/20 border border-cyan-400
            hover:bg-cyan-400 hover:text-black transition shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan]
            text-sm sm:text-base font-medium"
          >
             Live Webcam
          </button>

          <button
            onClick={()=>setShowLogs(!showLogs)}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-yellow-500/20 border border-yellow-400
            hover:bg-yellow-400 hover:text-black transition shadow-[0_0_15px_yellow] hover:shadow-[0_0_25px_yellow]
            text-sm sm:text-base font-medium sm:col-span-2 lg:col-span-1"
          >
            {showLogs ? " Hide Logs" : " View Logs"}
          </button>

        </div>

        {/* ================= LOGS ================= */}
        {showLogs && (
          <div className="animate-fadeIn">
            <h2 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-purple-300 font-semibold">
               All Detection Logs
            </h2>

            {/* Desktop View - Table */}
            <div className="hidden lg:block w-full overflow-x-auto border border-purple-500 rounded-lg shadow-[0_0_15px_purple]">
              
              <div className="max-h-[500px] overflow-y-auto">

                <table className="w-full text-sm">

                  <thead className="bg-[#020617] border-b border-purple-500 text-purple-300 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-left font-semibold">Email</th>
                      <th className="p-4 text-center font-semibold">Role</th>
                      <th className="p-4 text-center font-semibold">Status</th>
                      <th className="p-4 text-center font-semibold">Confidence</th>
                      <th className="p-4 text-center font-semibold">Source</th>
                      <th className="p-4 text-right font-semibold">Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center p-8 text-gray-400">
                          No logs available
                        </td>
                      </tr>
                    ) : (
                      logs.map((log,index)=>(
                        <tr key={index} className="border-b border-purple-900 hover:bg-purple-900/30 transition-colors">

                          <td className="text-left p-4 text-gray-300">{log.email}</td>
                          <td className="text-center p-4 text-gray-300">{log.role}</td>

                          <td className="text-center p-4">
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

                          <td className="text-center p-4 text-yellow-300">{log.source}</td>

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
                <div className="bg-[#020617] border border-purple-500 rounded-lg p-6 text-center text-gray-400">
                  No logs available
                </div>
              ) : (
                logs.map((log,index)=>(
                  <div 
                    key={index} 
                    className="bg-[#020617] border border-purple-500 rounded-lg p-4 sm:p-5 shadow-[0_0_10px_purple] hover:shadow-[0_0_20px_purple] transition-shadow"
                  >
                    {/* Email & Time */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <p className="text-sm text-gray-300 break-all">{log.email}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400 mb-1">Time</p>
                        <p className="text-xs text-gray-400">{log.timestamp}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                        log.status==="Mask"
                        ? "bg-green-900/40 text-green-400 border border-green-500"
                        : "bg-red-900/40 text-red-400 border border-red-500"
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Role</p>
                        <p className="text-gray-300">{log.role}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Confidence</p>
                        <p className="text-cyan-300 font-mono">{log.confidence?.toFixed(3)}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-400 mb-1">Source</p>
                        <p className="text-yellow-300">{log.source}</p>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard;