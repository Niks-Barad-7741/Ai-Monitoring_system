import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);
  const token = sessionStorage.getItem("token");

  // ==============================
  // 🔥 FETCH DASHBOARD DATA
  // ==============================
  const fetchDashboard = ()=>{
    axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      setStats(res.data);
      setLogs(res.data.logs || []);
    })
    .catch(()=>{
      alert("Session expired");
      sessionStorage.clear();
      window.location="/";
    });
  };

  // initial load
  useEffect(()=>{ fetchDashboard(); },[]);

  // ==============================
  // 🔴 LIVE SOCKET
  // ==============================
  useEffect(()=>{
    let ws;

    const connectSocket = ()=>{
      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onopen = ()=>{
        console.log("🔥 Admin LIVE connected");

        // keep alive
        setInterval(()=>{
          if(ws.readyState===1) ws.send("ping");
        },20000);
      };

      ws.onmessage = (event)=>{
        if(event.data==="new_detection"){
          fetchDashboard();
        }
      };

      ws.onclose = ()=>{
        console.log("Reconnecting socket...");
        setTimeout(connectSocket,2000);
      };
    };

    connectSocket();
    return ()=> ws && ws.close();
  },[]);

  const logout = ()=>{
    sessionStorage.clear();
    window.location="/";
  };

  if(!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f17] text-purple-400">
      Loading Dashboard...
    </div>
  );

  return(
    <div className="min-h-screen bg-[#0b0f17] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-purple-400 drop-shadow-lg">
          🛡 AI Monitoring Admin
        </h1>

        <button 
          onClick={logout}
          className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <p className="text-purple-300 mb-10">Welcome Admin: {stats.admin}</p>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">

        <div className="bg-[#111827] border border-purple-500 rounded-2xl p-6 
        shadow-[0_0_25px_rgba(168,85,247,0.4)] text-center transition-all duration-300 
        hover:scale-105 hover:shadow-[0_0_35px_rgba(168,85,247,0.6)]">
          <h2 className="text-purple-300">Total Detections</h2>
          <p className="text-4xl font-bold mt-2 text-cyan-400">
            {stats.total_detections}
          </p>
        </div>

        <div className="bg-[#111827] border border-cyan-500 rounded-2xl p-6 
        shadow-[0_0_25px_rgba(34,211,238,0.4)] text-center transition-all duration-300 
        hover:scale-105 hover:shadow-[0_0_35px_rgba(34,211,238,0.6)]">
          <h2 className="text-cyan-300">Mask 😷</h2>
          <p className="text-4xl font-bold mt-2 text-cyan-400">
            {stats.mask_detected}
          </p>
        </div>

        <div className="bg-[#111827] border border-pink-500 rounded-2xl p-6 
        shadow-[0_0_25px_rgba(236,72,153,0.4)] text-center transition-all duration-300 
        hover:scale-105 hover:shadow-[0_0_35px_rgba(236,72,153,0.6)]">
          <h2 className="text-pink-400">No Mask ❌</h2>
          <p className="text-4xl font-bold mt-2 text-pink-400">
            {stats.no_mask_detected}
          </p>
        </div>

      </div>

      {/* ================= BUTTONS (NEON STYLE) ================= */}
      <div className="flex justify-center gap-10 mb-12">

        {/* 🟣 Upload Button: Transparent -> Purple Fill */}
        <button
          onClick={()=>window.location="/upload"}
          className="px-10 py-4 rounded-xl text-lg font-semibold tracking-wider
          border-2 border-purple-500 text-purple-400 bg-transparent
          shadow-[0_0_15px_rgba(168,85,247,0.3)]
          transition-all duration-300 ease-in-out
          hover:bg-purple-600 hover:text-white hover:border-purple-600
          hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] hover:scale-105"
        >
          Upload Detection
        </button>

        {/* 🔵 Webcam Button: Transparent -> Cyan Fill */}
        <button
          onClick={()=>window.location="/webcam"}
          className="px-10 py-4 rounded-xl text-lg font-semibold tracking-wider
          border-2 border-cyan-500 text-cyan-400 bg-transparent
          shadow-[0_0_15px_rgba(6,182,212,0.3)]
          transition-all duration-300 ease-in-out
          hover:bg-cyan-500 hover:text-black hover:border-cyan-500
          hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-105"
        >
          Live Webcam
        </button>

      </div>

      {/* ================= LOG TABLE ================= */}
      <h2 className="text-2xl text-purple-400 mb-4">Live Detection Logs</h2>

      <div className="bg-[#111827] border border-purple-500 rounded-2xl p-4 
      shadow-[0_0_20px_rgba(168,85,247,0.4)] max-h-[450px] overflow-auto">

        <table className="w-full text-sm">
          <thead className="text-purple-300 border-b border-purple-700">
            <tr>
              <th className="py-2">Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log,index)=>(
              <tr key={index} className="text-center border-b border-gray-800 hover:bg-[#1f2937]">
                <td className="py-2">{log.email}</td>
                <td>{log.role}</td>

                <td className={
                  log.status==="Mask"
                  ? "text-green-400 font-bold"
                  : "text-red-400 font-bold"
                }>
                  {log.status}
                </td>

                <td className="text-cyan-400">
                  {log.confidence?.toFixed(3)}
                </td>

                <td className="text-purple-300">{log.source}</td>
                <td className="text-gray-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default AdminDashboard;