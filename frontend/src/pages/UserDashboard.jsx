import { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);
  const [showLogs,setShowLogs] = useState(false);

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  // ===============================
  // FETCH USER DATA
  // ===============================
  const fetchUser = ()=>{
    axios.get("http://127.0.0.1:8000/dashboard/user-dashboard",{
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

  useEffect(()=>{ fetchUser(); },[]);

  // ===============================
  // LIVE SOCKET
  // ===============================
  useEffect(()=>{
    let ws;

    const connectSocket = ()=>{
      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onmessage = ()=> fetchUser();

      ws.onclose = ()=> setTimeout(connectSocket,2000);
    };

    connectSocket();
    return ()=> ws && ws.close();
  },[]);

  const logout = ()=>{
    sessionStorage.clear();
    window.location="/";
  }

  if(!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-cyan-400">
      Loading Dashboard...
    </div>
  );

  return(
    <div className="min-h-screen bg-[#020617] text-white px-4 py-6 md:p-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:block relative mb-12">

        {/* Logout Button */}
        <div className="md:absolute md:right-0 md:top-0 mb-6 md:mb-0 text-center md:text-right z-50">
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Title Center */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_15px_cyan]">
             User Control Panel
          </h1>

          <p className="mt-2 text-sm md:text-base text-gray-400 break-all">
            Logged in as <span className="text-cyan-300">{email}</span>
          </p>
        </div>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        <div className="bg-[#020617] border border-cyan-500 rounded-xl p-6 md:p-8 text-center shadow-[0_0_15px_cyan]">
          <h2 className="text-gray-400">Total</h2>
          <p className="text-3xl md:text-4xl text-cyan-300 mt-2">{stats.your_total_detections}</p>
        </div>

        <div className="bg-[#020617] border border-green-400 rounded-xl p-6 md:p-8 text-center shadow-[0_0_15px_green]">
          <h2 className="text-gray-400">Mask </h2>
          <p className="text-3xl md:text-4xl text-green-400 mt-2">{stats.mask_detected}</p>
        </div>

        <div className="bg-[#020617] border border-red-500 rounded-xl p-6 md:p-8 text-center shadow-[0_0_15px_red]">
          <h2 className="text-gray-400">No Mask </h2>
          <p className="text-3xl md:text-4xl text-red-400 mt-2">{stats.no_mask_detected}</p>
        </div>

      </div>

      {/* ================= BUTTONS ================= */}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-12">

        <button
          onClick={()=>window.location="/upload"}
          className="w-full md:w-auto px-8 py-4 rounded-lg bg-cyan-500/20 border border-cyan-400
          hover:bg-cyan-400 hover:text-black transition shadow-[0_0_15px_cyan]"
        >
           Upload Detection
        </button>

        <button
          onClick={()=>window.location="/webcam"}
          className="w-full md:w-auto px-8 py-4 rounded-lg bg-purple-500/20 border border-purple-400
          hover:bg-purple-400 hover:text-black transition shadow-[0_0_15px_purple]"
        >
           Live Webcam
        </button>

        <button
          onClick={()=>setShowLogs(!showLogs)}
          className="w-full md:w-auto px-8 py-4 rounded-lg bg-yellow-500/20 border border-yellow-400
          hover:bg-yellow-400 hover:text-black transition shadow-[0_0_15px_yellow]"
        >
          {showLogs ? " Hide Logs" : " View Logs"}
        </button>

      </div>

      {/* ================= LOGS ================= */}
      {showLogs && (
        <>
          <h2 className="text-xl md:text-2xl mb-4 text-cyan-300">Your Detection Logs</h2>

          {/* mobile scroll wrapper */}
          <div className="w-full overflow-x-auto border border-cyan-500 rounded-lg shadow-[0_0_15px_cyan]">
            
            <div className="max-h-[420px] overflow-y-auto">

              <table className="min-w-[600px] w-full text-sm md:text-base">

                <thead className="bg-[#020617] border-b border-cyan-500 text-cyan-300 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Status</th>
                    <th>Confidence</th>
                    <th>Source</th>
                    <th className="text-right pr-4">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log,index)=>(
                    <tr key={index} className="text-center border-b border-cyan-900 hover:bg-cyan-900/20">

                      <td className="text-left p-3">
                        <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                          log.status==="Mask"
                          ? "bg-green-900/40 text-green-400 border border-green-500"
                          : "bg-red-900/40 text-red-400 border border-red-500"
                        }`}>
                          {log.status}
                        </span>
                      </td>

                      <td className="text-cyan-300">
                        {log.confidence?.toFixed(3)}
                      </td>

                      <td className="text-yellow-300">{log.source}</td>

                      <td className="text-gray-400 text-right pr-4 text-xs md:text-sm">
                        {log.timestamp}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default UserDashboard;
