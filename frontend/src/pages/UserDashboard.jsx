// import { useEffect, useState } from "react";
// import axios from "axios";

// function UserDashboard(){

//   const [stats,setStats] = useState(null);

//   const token = sessionStorage.getItem("token");
//   const email = sessionStorage.getItem("email");

//   // ===============================
//   // 🔥 FETCH USER DATA
//   // ===============================
//   const fetchUser = ()=>{
//     axios.get("http://127.0.0.1:8000/dashboard/user-dashboard",{
//       headers:{ Authorization:`Bearer ${token}` }
//     })
//     .then(res=>{
//       console.log("📊 User refresh:",res.data);
//       setStats(res.data);
//     })
//     .catch(()=>{
//       alert("Session expired login again");
//       sessionStorage.clear();
//       window.location="/";
//     });
//   }

//   // ===============================
//   // 🟢 INITIAL LOAD
//   // ===============================
//   useEffect(()=>{
//     fetchUser();
//   },[])

//   // ===============================
//   // 🔴 LIVE SOCKET
//   // ===============================
//   useEffect(()=>{

//     const ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

//     ws.onopen = ()=>{
//       console.log("🔥 User connected to LIVE server");
//     };

//     ws.onmessage = (event)=>{
//       console.log("⚡ Live update:", event.data);
//       fetchUser(); // auto refresh stats
//     };

//     ws.onerror = ()=>{
//       console.log("Socket error");
//     };

//     ws.onclose = ()=>{
//       console.log("Socket closed");
//     };

//     return ()=> ws.close();

//   },[]);

//   // ===============================
//   // 🚪 LOGOUT
//   // ===============================
//   const logout = ()=>{
//     sessionStorage.clear();
//     window.location="/";
//   }

//   if(!stats) return <h1 className="text-white text-center mt-20">Loading...</h1>

//   return(
//     <div className="min-h-screen bg-black text-green-400 p-10">

//       <h1 className="text-4xl text-center mb-10">🚀 User Dashboard</h1>
//       <p className="text-center mb-10">Welcome: {email}</p>

//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2>Total</h2>
//           <p className="text-3xl">{stats.your_total_detections}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2>Mask 😷</h2>
//           <p className="text-3xl">{stats.mask_detected}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2>No Mask 🚫</h2>
//           <p className="text-3xl">{stats.no_mask_detected}</p>
//         </div>

//       </div>

//       <div className="flex justify-center gap-6 mb-10">

//         <button
//           onClick={()=>window.location="/upload"}
//           className="bg-green-600 px-6 py-3 rounded"
//         >
//           Upload Detection
//         </button>

//         <button
//           onClick={()=>window.location="/webcam"}
//           className="bg-purple-600 px-6 py-3 rounded"
//         >
//           Live Webcam
//         </button>

//       </div>

//       <div className="text-center">
//         <button onClick={logout} className="bg-red-600 px-6 py-2 rounded">
//           Logout
//         </button>
//       </div>

//     </div>
//   )
// }

// export default UserDashboard;
// import { useEffect, useState } from "react";
// import axios from "axios";

// function UserDashboard(){

//   const [stats,setStats] = useState(null);

//   const token = sessionStorage.getItem("token");
//   const email = sessionStorage.getItem("email");

//   // ===============================
//   // 🔥 FETCH USER DATA
//   // ===============================
//   const fetchUser = ()=>{
//     axios.get("http://127.0.0.1:8000/dashboard/user-dashboard",{
//       headers:{ Authorization:`Bearer ${token}` }
//     })
//     .then(res=>{
//       console.log("📊 User refresh:",res.data);
//       setStats(res.data);
//     })
//     .catch(()=>{
//       alert("Session expired login again");
//       sessionStorage.clear();
//       window.location="/";
//     });
//   }

//   // ===============================
//   // 🟢 INITIAL LOAD
//   // ===============================
//   useEffect(()=>{
//     fetchUser();
//   },[])

//   // ===============================
//   // 🔴 LIVE SOCKET (FIXED)
//   // ===============================
// useEffect(()=>{

//   let ws;

//   const connectSocket = ()=>{

//     ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

//     ws.onopen = ()=>{
//       console.log("🔥 User connected to LIVE server");

//       setInterval(()=>{
//         if(ws.readyState === 1){
//           ws.send("ping");
//         }
//       },20000);
//     };

//     ws.onmessage = (event)=>{
//       console.log("⚡ User live update:",event.data);
//       fetchUser();
//     };

//     ws.onerror = ()=>{
//       console.log("❌ Socket error");
//     };

//     ws.onclose = ()=>{
//       console.log("🔌 Socket closed. Reconnecting in 2s...");
//       setTimeout(connectSocket,2000);
//     };
//   };

//   connectSocket();

//   return ()=> ws && ws.close();

// },[]);

//   // ===============================
//   // 🚪 LOGOUT
//   // ===============================
//   const logout = ()=>{
//     sessionStorage.clear();
//     window.location="/";
//   }

//   if(!stats) return <h1 className="text-white text-center mt-20">Loading...</h1>

//   return(
//     <div className="min-h-screen bg-black text-green-400 p-10">

//       <h1 className="text-4xl text-center mb-10">🚀 User Dashboard</h1>
//       <p className="text-center mb-10">Welcome: {email}</p>

//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2>Total</h2>
//           <p className="text-3xl">{stats.your_total_detections}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2>Mask 😷</h2>
//           <p className="text-3xl">{stats.mask_detected}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2>No Mask 🚫</h2>
//           <p className="text-3xl">{stats.no_mask_detected}</p>
//         </div>

//       </div>

//       <div className="flex justify-center gap-6 mb-10">

//         <button onClick={()=>window.location="/upload"} className="bg-green-600 px-6 py-3 rounded">
//           Upload Detection
//         </button>

//         <button onClick={()=>window.location="/webcam"} className="bg-purple-600 px-6 py-3 rounded">
//           Live Webcam
//         </button>

//       </div>

//       <div className="text-center">
//         <button onClick={logout} className="bg-red-600 px-6 py-2 rounded">
//           Logout
//         </button>
//       </div>

//     </div>
//   )
// }

// export default UserDashboard;
import { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard(){

  const [stats,setStats] = useState(null);
  const [logs,setLogs] = useState([]);

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  // ===============================
  // 🔥 FETCH USER DATA
  // ===============================
  const fetchUser = ()=>{
    axios.get("http://127.0.0.1:8000/dashboard/user-dashboard",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      console.log("📊 User refresh:",res.data);
      setStats(res.data);
      setLogs(res.data.logs || []);
    })
    .catch(()=>{
      alert("Session expired login again");
      sessionStorage.clear();
      window.location="/";
    });
  }

  // initial load
  useEffect(()=>{
    fetchUser();
  },[])

  // ===============================
  // 🔴 LIVE SOCKET
  // ===============================
  useEffect(()=>{

    let ws;

    const connectSocket = ()=>{
      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onopen = ()=>{
        console.log("🔥 User connected to LIVE server");
      };

      ws.onmessage = (event)=>{
        console.log("⚡ User live update:",event.data);
        fetchUser(); // auto refresh logs + stats
      };

      ws.onclose = ()=>{
        console.log("🔌 Socket closed. Reconnecting...");
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

  if(!stats) return <h1 className="text-white text-center mt-20">Loading...</h1>

  return(
    <div className="min-h-screen bg-black text-green-400 p-10">

      <h1 className="text-4xl text-center mb-10">🚀 User Dashboard</h1>
      <p className="text-center mb-10">Welcome: {email}</p>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="border border-green-500 p-6 rounded-xl text-center">
          <h2>Total</h2>
          <p className="text-3xl">{stats.your_total_detections}</p>
        </div>

        <div className="border border-green-500 p-6 rounded-xl text-center">
          <h2>Mask 😷</h2>
          <p className="text-3xl">{stats.mask_detected}</p>
        </div>

        <div className="border border-green-500 p-6 rounded-xl text-center">
          <h2>No Mask 🚫</h2>
          <p className="text-3xl">{stats.no_mask_detected}</p>
        </div>

      </div>

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-center gap-6 mb-10">
        <button onClick={()=>window.location="/upload"} className="bg-green-600 px-6 py-3 rounded">
          Upload Detection
        </button>

        <button onClick={()=>window.location="/webcam"} className="bg-purple-600 px-6 py-3 rounded">
          Live Webcam
        </button>
      </div>

      {/* ===== USER LOG TABLE ===== */}
      <h2 className="text-2xl mb-4">Your Detection Logs</h2>

      <div className="overflow-auto max-h-[400px] border border-green-500">
        <table className="w-full text-sm">
          <thead className="bg-green-900">
            <tr>
              <th>Status</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log,index)=>(
              <tr key={index} className="text-center border-b border-green-800">
                <td>{log.status}</td>
                <td>{log.confidence?.toFixed(3)}</td>
                <td>{log.source}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* logout */}
      <div className="text-center mt-8">
        <button onClick={logout} className="bg-red-600 px-6 py-2 rounded">
          Logout
        </button>
      </div>

    </div>
  )
}

export default UserDashboard;
