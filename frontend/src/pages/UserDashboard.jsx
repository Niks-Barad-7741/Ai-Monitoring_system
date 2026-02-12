import { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);

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

  useEffect(()=>{
    fetchUser();
  },[])

  // ===============================
  // LIVE SOCKET
  // ===============================
  useEffect(()=>{
    let ws;

    const connectSocket = ()=>{
      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onopen = ()=>{
        console.log("🔥 User connected");
      };

      ws.onmessage = ()=>{
        fetchUser(); // auto refresh
      };

      ws.onclose = ()=>{
        setTimeout(connectSocket,2000);
      };
    };

    connectSocket();
    return ()=> ws && ws.close();
  },[]);

  const logout = ()=>{
    sessionStorage.clear();
    window.location="/";
  }

  if(!stats) return <h1 className="text-cyan-400 text-center mt-20">Loading...</h1>

  return(
    <div className="min-h-screen bg-[#020617] text-cyan-400 p-10">

      {/* HEADER */}
      <h1 className="text-5xl text-center mb-4 font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_10px_cyan]">
        USER CONTROL PANEL
      </h1>

      <p className="text-center mb-12 text-gray-400">
        Logged in as <span className="text-cyan-300">{email}</span>
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-8 mb-12">

        <div className="bg-[#020617] border border-cyan-500 rounded-xl p-8 text-center shadow-[0_0_25px_#00ffff55]">
          <h2 className="text-gray-400">Total</h2>
          <p className="text-4xl text-cyan-300 mt-2">{stats.your_total_detections}</p>
        </div>

        <div className="bg-[#020617] border border-green-400 rounded-xl p-8 text-center shadow-[0_0_25px_#22c55e55]">
          <h2 className="text-gray-400">Mask 😷</h2>
          <p className="text-4xl text-green-400 mt-2">{stats.mask_detected}</p>
        </div>

        <div className="bg-[#020617] border border-red-500 rounded-xl p-8 text-center shadow-[0_0_25px_#ef444455]">
          <h2 className="text-gray-400">No Mask 🚫</h2>
          <p className="text-4xl text-red-400 mt-2">{stats.no_mask_detected}</p>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex justify-center gap-10 mb-12">

        <button
          onClick={()=>window.location="/upload"}
          className="px-8 py-4 rounded-lg bg-cyan-500/20 border border-cyan-400
          hover:bg-cyan-400 hover:text-black transition-all duration-300
          shadow-[0_0_15px_cyan]"
        >
          Upload Detection
        </button>

        <button
          onClick={()=>window.location="/webcam"}
          className="px-8 py-4 rounded-lg bg-purple-500/20 border border-purple-400
          hover:bg-purple-400 hover:text-black transition-all duration-300
          shadow-[0_0_15px_purple]"
        >
          Live Webcam
        </button>

      </div>

      {/* USER LOG TABLE */}
      <h2 className="text-2xl mb-4 text-cyan-300">Your Detection Logs</h2>

      <div className="overflow-auto max-h-[420px] border border-cyan-500 rounded-lg shadow-[0_0_15px_#00ffff55]">

        <table className="w-full text-sm">
          <thead className="bg-[#020617] border-b border-cyan-500 text-cyan-300">
            <tr>
              <th className="p-3">Status</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log,index)=>(
              <tr key={index} className="text-center border-b border-cyan-900 hover:bg-cyan-900/20">

                <td className={
                  log.status === "Mask"
                  ? "text-green-400 p-2"
                  : "text-red-400 p-2"
                }>
                  {log.status}
                </td>

                <td>{log.confidence?.toFixed(3)}</td>
                <td className="text-yellow-300">{log.source}</td>
                <td className="text-gray-400">{log.timestamp}</td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* LOGOUT */}
      <div className="text-center mt-10">
        <button
          onClick={logout}
          className="px-8 py-3 bg-red-600/20 border border-red-500 rounded-lg
          hover:bg-red-500 hover:text-black transition-all duration-300
          shadow-[0_0_15px_red]"
        >
          Logout
        </button>
      </div>

    </div>
  )
}

export default UserDashboard;