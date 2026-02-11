// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // function AdminDashboard(){

// //   const [stats,setStats] = useState(null);
// //   const [logs,setLogs] = useState([]);

// //   const token = sessionStorage.getItem("token");
// //   const email = sessionStorage.getItem("email");

// //   // =============================
// //   // 🔐 FETCH ADMIN DATA
// //   // =============================
// //   useEffect(()=>{

// //     axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
// //       headers:{
// //         Authorization:`Bearer ${token}`
// //       }
// //     })
// //     .then(res=>{
// //       setStats(res.data.stats);
// //       setLogs(res.data.logs);
// //     })
// //     .catch(err=>{
// //       alert("Session expired login again");
// //       sessionStorage.clear();
// //       window.location="/";
// //     });

// //   },[])


// //   const logout = ()=>{
// //     sessionStorage.clear();
// //     window.location="/";
// //   }

// //   if(!stats) return <h1 className="text-center mt-20 text-green-400">Loading...</h1>

// //   return(
// //     <div className="min-h-screen bg-black text-green-400 p-10">

// //       {/* TITLE */}
// //       <h1 className="text-4xl text-center mb-3 font-bold">
// //         👑 Admin Control Panel
// //       </h1>

// //       <p className="text-center mb-10">Welcome: {email}</p>

// //       {/* ================= STATS ================= */}
// //       <div className="grid grid-cols-3 gap-6 mb-10">

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>Total Detections</h2>
// //           <p className="text-3xl">{stats.total}</p>
// //         </div>

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>Mask 😷</h2>
// //           <p className="text-3xl">{stats.mask}</p>
// //         </div>

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>No Mask 🚫</h2>
// //           <p className="text-3xl">{stats.nomask}</p>
// //         </div>

// //       </div>

// //       {/* ================= BUTTONS ================= */}
// //       <div className="flex justify-center gap-6 mb-10">

// //         <button
// //           onClick={()=>window.location="/upload"}
// //           className="bg-green-600 px-6 py-3 rounded"
// //         >
// //           📤 Upload Detection
// //         </button>

// //         <button
// //           onClick={()=>window.location="/webcam"}
// //           className="bg-purple-600 px-6 py-3 rounded"
// //         >
// //           🎥 Live Webcam
// //         </button>

// //       </div>

// //       {/* ================= LOG TABLE ================= */}
// //       <div className="border border-green-500 rounded-xl p-5">

// //         <h2 className="text-xl mb-4">📜 All Detection Logs</h2>

// //         <table className="w-full text-center">
// //           <thead>
// //             <tr className="border-b border-green-500">
// //               <th>User</th>
// //               <th>Result</th>
// //               <th>Time</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {logs.map((log,i)=>(
// //               <tr key={i} className="border-b border-green-900">
// //                 <td>{log.email}</td>
// //                 <td>{log.result}</td>
// //                 <td>{log.time}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //       </div>

// //       {/* LOGOUT */}
// //       <div className="text-center mt-10">
// //         <button
// //           onClick={logout}
// //           className="bg-red-600 px-6 py-2 rounded"
// //         >
// //           Logout
// //         </button>
// //       </div>

// //     </div>
// //   )
// // }

// // export default AdminDashboard;
// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // function AdminDashboard(){

// //   const [stats,setStats] = useState(null);

// //   const token = sessionStorage.getItem("token");
// //   const email = sessionStorage.getItem("email");

// //   // =========================
// //   // 🔥 GET ADMIN DATA
// //   // =========================
// //   useEffect(()=>{

// //     axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
// //       headers:{
// //         Authorization:`Bearer ${token}`
// //       }
// //     })
// //     .then(res=>{
// //       setStats(res.data);
// //     })
// //     .catch(err=>{
// //       alert("Session expired login again");
// //       sessionStorage.clear();
// //       window.location="/";
// //     });

// //   },[])

// //   // =========================
// //   // 🚪 LOGOUT
// //   // =========================
// //   const logout = ()=>{
// //     sessionStorage.clear();
// //     window.location="/";
// //   }

// //   if(!stats) return <h1 className="text-center mt-20 text-green-400">Loading admin panel...</h1>

// //   return(
// //     <div className="min-h-screen bg-black text-green-400 p-10">

// //       <h1 className="text-4xl text-center font-bold mb-6">
// //         👑 Admin Control Panel
// //       </h1>

// //       <p className="text-center mb-10">
// //         Welcome Admin: {email}
// //       </p>

// //       {/* ================= STATS ================= */}
// //       <div className="grid grid-cols-3 gap-6 mb-12">

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>Total Detections</h2>
// //           <p className="text-3xl">{stats.total_detections}</p>
// //         </div>

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>Mask 😷</h2>
// //           <p className="text-3xl">{stats.mask_detected}</p>
// //         </div>

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>No Mask 🚫</h2>
// //           <p className="text-3xl">{stats.no_mask_detected}</p>
// //         </div>

// //       </div>

// //       {/* ================= ACTION BUTTONS ================= */}
// //       <div className="flex justify-center gap-6 mb-10">

// //         <button
// //           onClick={()=>window.location="/upload"}
// //           className="bg-green-600 px-6 py-3 rounded"
// //         >
// //           📤 Upload Detection
// //         </button>

// //         <button
// //           onClick={()=>window.location="/webcam"}
// //           className="bg-purple-600 px-6 py-3 rounded"
// //         >
// //           🎥 Live Webcam
// //         </button>

// //       </div>

// //       {/* ================= LOGOUT ================= */}
// //       <div className="text-center">
// //         <button
// //           onClick={logout}
// //           className="bg-red-600 px-6 py-2 rounded"
// //         >
// //           Logout
// //         </button>
// //       </div>

// //     </div>
// //   )
// // }

// // export default AdminDashboard;
// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // function AdminDashboard(){

// //   const [stats,setStats] = useState(null);
// //   const [logs,setLogs] = useState([]);

// //   const token = sessionStorage.getItem("token");

// //   // =============================
// //   // FETCH ADMIN DATA
// //   // =============================
// //   useEffect(()=>{

// //     axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
// //       headers:{
// //         Authorization:`Bearer ${token}`
// //       }
// //     })
// //     .then(res=>{
// //       console.log(res.data);
// //       setStats(res.data);
// //       setLogs(res.data.logs); // backend sends logs list
// //     })
// //     .catch(err=>{
// //       alert("Session expired login again");
// //       sessionStorage.clear();
// //       window.location="/";
// //     });

// //   },[]);

// //   const logout = ()=>{
// //     sessionStorage.clear();
// //     window.location="/";
// //   }

// //   if(!stats) return <h1 className="text-center mt-20 text-green-400">Loading admin data...</h1>

// //   return(
// //     <div className="min-h-screen bg-black text-green-400 p-10">

// //       <h1 className="text-4xl font-bold text-center mb-10">
// //         🛡 ADMIN CONTROL PANEL
// //       </h1>

// //       {/* ===================== STATS ===================== */}
// //       <div className="grid grid-cols-3 gap-6 mb-10">

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>Total Detections</h2>
// //           <p className="text-3xl">{stats.total_detections}</p>
// //         </div>

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>Mask 😷</h2>
// //           <p className="text-3xl">{stats.mask_detected}</p>
// //         </div>

// //         <div className="border border-green-500 p-6 rounded-xl text-center">
// //           <h2>No Mask 🚫</h2>
// //           <p className="text-3xl">{stats.no_mask_detected}</p>
// //         </div>

// //       </div>

// //       {/* ===================== LOG TABLE ===================== */}
// //       <h2 className="text-2xl mb-4">📊 Detection Logs</h2>

// //       <div className="overflow-x-auto">
// //         <table className="w-full border border-green-500">

// //           <thead className="bg-green-900">
// //             <tr>
// //               <th className="p-3">Email</th>
// //               <th>Status</th>
// //               <th>Confidence</th>
// //               <th>Source</th>
// //               <th>Time</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {logs.map((log,i)=>(
// //               <tr key={i} className="text-center border-t border-green-700">

// //                 <td className="p-2">{log.email}</td>
// //                 <td>{log.status}</td>
// //                 <td>{(log.confidence*100).toFixed(2)}%</td>
// //                 <td>{log.source}</td>
// //                 <td>{log.timestamp}</td>

// //               </tr>
// //             ))}
// //           </tbody>

// //         </table>
// //       </div>

// //       {/* LOGOUT */}
// //       <div className="text-center mt-10">
// //         <button
// //           onClick={logout}
// //           className="bg-red-600 px-6 py-2 rounded"
// //         >
// //           Logout
// //         </button>
// //       </div>

// //     </div>
// //   )
// // }

// // export default AdminDashboard;
// import { useEffect, useState } from "react";
// import axios from "axios";

// function AdminDashboard(){

//   const [stats,setStats] = useState(null);
//   const token = sessionStorage.getItem("token");

//   useEffect(()=>{

//     axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
//       headers:{ Authorization:`Bearer ${token}` }
//     })
//     .then(res=>{
//       console.log(res.data);
//       setStats(res.data);
//     })
//     .catch(err=>{
//       alert("Session expired");
//       sessionStorage.clear();
//       window.location="/";
//     });

//   },[])

//   const logout = ()=>{
//     sessionStorage.clear();
//     window.location="/";
//   }

//   if(!stats) return <h1 className="text-center mt-20 text-green-400">Loading...</h1>

//   return(
//     <div className="min-h-screen bg-black text-green-400 p-10">

//       <h1 className="text-4xl text-center mb-10">🛡 Admin Dashboard</h1>

//       <p className="text-center mb-10">Welcome Admin: {stats.admin}</p>

//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <div className="border border-green-500 p-6 text-center rounded">
//           <h2>Total Detections</h2>
//           <p className="text-3xl">{stats.total_detections}</p>
//         </div>

//         <div className="border border-green-500 p-6 text-center rounded">
//           <h2>Mask 😷</h2>
//           <p className="text-3xl">{stats.mask_detected}</p>
//         </div>

//         <div className="border border-green-500 p-6 text-center rounded">
//           <h2>No Mask ❌</h2>
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

// export default AdminDashboard;
// import { useEffect, useState } from "react";
// import axios from "axios";

// function AdminDashboard(){

//   const [stats,setStats] = useState(null);
//   const [logs,setLogs] = useState([]);

//   const token = sessionStorage.getItem("token");

//   useEffect(()=>{

//     axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     })
//     .then(res=>{
//       console.log(res.data);
//       setStats(res.data);
//       setLogs(res.data.logs);   // 🔥 IMPORTANT
//     })
//     .catch(err=>{
//       alert("Session expired");
//       sessionStorage.clear();
//       window.location="/";
//     });

//   },[]);

//   const logout = ()=>{
//     sessionStorage.clear();
//     window.location="/";
//   };

//   if(!stats) return <h1 className="text-white text-center mt-20">Loading...</h1>;

//   return(
//     <div className="min-h-screen bg-black text-green-400 p-10">

//       <h1 className="text-4xl text-center mb-8">🛡 Admin Dashboard</h1>

//       <p className="text-center mb-10">Welcome Admin: {stats.admin}</p>

//       {/* ===== STATS ===== */}
//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <div className="border border-green-500 p-6 rounded text-center">
//           <h2>Total Detections</h2>
//           <p className="text-3xl">{stats.total_detections}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded text-center">
//           <h2>Mask 😷</h2>
//           <p className="text-3xl">{stats.mask_detected}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded text-center">
//           <h2>No Mask ❌</h2>
//           <p className="text-3xl">{stats.no_mask_detected}</p>
//         </div>

//       </div>

//       {/* ===== BUTTONS ===== */}
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

//       {/* ===== LOG TABLE ===== */}
//       <h2 className="text-2xl mb-4">All Detection Logs</h2>

//       <div className="overflow-auto max-h-[400px] border border-green-500">

//         <table className="w-full text-sm">
//           <thead className="bg-green-900">
//             <tr>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Confidence</th>
//               <th>Source</th>
//               <th>Time</th>
//             </tr>
//           </thead>

//           <tbody>
//             {logs.map((log,index)=>(
//               <tr key={index} className="text-center border-b border-green-800">
//                 <td>{log.email}</td>
//                 <td>{log.role}</td>
//                 <td>{log.status}</td>
//                 <td>{log.confidence?.toFixed(3)}</td>
//                 <td>{log.source}</td>
//                 <td>{log.timestamp}</td>
//               </tr>
//             ))}
//           </tbody>

//         </table>

//       </div>

//       {/* ===== LOGOUT ===== */}
//       <div className="text-center mt-8">
//         <button onClick={logout} className="bg-red-600 px-6 py-2 rounded">
//           Logout
//         </button>
//       </div>

//     </div>
//   )
// }

// export default AdminDashboard;
// import { useEffect, useState } from "react";
// import axios from "axios";

// function AdminDashboard(){

//   const [stats,setStats] = useState(null);
//   const [logs,setLogs] = useState([]);

//   const token = sessionStorage.getItem("token");

//   // ==============================
//   // 🔥 FETCH DASHBOARD DATA
//   // ==============================
//   const fetchDashboard = ()=>{
//     axios.get("http://127.0.0.1:8000/dashboard/admin-dashboard",{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     })
//     .then(res=>{
//       console.log("📊 Dashboard refresh:",res.data);
//       setStats(res.data);
//       setLogs(res.data.logs || []);
//     })
//     .catch(()=>{
//       alert("Session expired");
//       sessionStorage.clear();
//       window.location="/";
//     });
//   };

//   // ==============================
//   // 🚀 INITIAL LOAD + LIVE SOCKET
//   // ==============================
//   useEffect(()=>{

//     // first load
//     fetchDashboard();

//     // 🔴 CONNECT TO WEBSOCKET SERVER
//     const socket = new WebSocket("ws://127.0.0.1:8000/ws/live");

//     socket.onopen = ()=>{
//       console.log("🔥 Admin connected to LIVE server");
//     };

//     socket.onmessage = (event)=>{
//       console.log("⚡ LIVE EVENT:",event.data);

//       if(event.data === "new_detection"){
//         console.log("♻ Auto refreshing dashboard...");
//         fetchDashboard();
//       }
//     };

//     socket.onerror = (err)=>{
//       console.log("Socket error:",err);
//     };

//     socket.onclose = ()=>{
//       console.log("Socket closed");
//     };

//     return ()=>{
//       socket.close();
//     };

//   },[]);

//   // ==============================
//   // 🚪 LOGOUT
//   // ==============================
//   const logout = ()=>{
//     sessionStorage.clear();
//     window.location="/";
//   };

//   if(!stats) return <h1 className="text-white text-center mt-20">Loading...</h1>;

//   return(
//     <div className="min-h-screen bg-black text-green-400 p-10">

//       <h1 className="text-4xl text-center mb-8">🛡 Admin Dashboard</h1>

//       <p className="text-center mb-10">Welcome Admin: {stats.admin}</p>

//       {/* ===== STATS ===== */}
//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <div className="border border-green-500 p-6 rounded text-center">
//           <h2>Total Detections</h2>
//           <p className="text-3xl">{stats.total_detections}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded text-center">
//           <h2>Mask 😷</h2>
//           <p className="text-3xl">{stats.mask_detected}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded text-center">
//           <h2>No Mask ❌</h2>
//           <p className="text-3xl">{stats.no_mask_detected}</p>
//         </div>

//       </div>

//       {/* ===== BUTTONS ===== */}
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

//       {/* ===== LOG TABLE ===== */}
//       <h2 className="text-2xl mb-4">All Detection Logs</h2>

//       <div className="overflow-auto max-h-[400px] border border-green-500">
//         <table className="w-full text-sm">
//           <thead className="bg-green-900">
//             <tr>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Confidence</th>
//               <th>Source</th>
//               <th>Time</th>
//             </tr>
//           </thead>

//           <tbody>
//             {logs.map((log,index)=>(
//               <tr key={index} className="text-center border-b border-green-800">
//                 <td>{log.email}</td>
//                 <td>{log.role}</td>
//                 <td>{log.status}</td>
//                 <td>{log.confidence?.toFixed(3)}</td>
//                 <td>{log.source}</td>
//                 <td>{log.timestamp}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== LOGOUT ===== */}
//       <div className="text-center mt-8">
//         <button onClick={logout} className="bg-red-600 px-6 py-2 rounded">
//           Logout
//         </button>
//       </div>

//     </div>
//   )
// }

// export default AdminDashboard;
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
      console.log("📊 Dashboard refresh:",res.data);
      setStats(res.data);
      setLogs(res.data.logs || []);
    })
    .catch(()=>{
      alert("Session expired");
      sessionStorage.clear();
      window.location="/";
    });
  };

  // ==============================
  // 🚀 INITIAL LOAD
  // ==============================
  useEffect(()=>{
    fetchDashboard();
  },[]);

  // ==============================
  // 🔴 LIVE SOCKET (AUTO RECONNECT)
  // ==============================
  useEffect(()=>{

    let ws;

    const connectSocket = ()=>{

      ws = new WebSocket("ws://127.0.0.1:8000/ws/live");

      ws.onopen = ()=>{
        console.log("🔥 Admin connected to LIVE server");

        // keep alive ping
        setInterval(()=>{
          if(ws.readyState === 1){
            ws.send("ping");
          }
        },20000);
      };

      ws.onmessage = (event)=>{
        console.log("⚡ LIVE EVENT:",event.data);

        if(event.data === "new_detection"){
          fetchDashboard(); // auto refresh
        }
      };

      ws.onerror = ()=>{
        console.log("❌ Socket error");
      };

      ws.onclose = ()=>{
        console.log("🔌 Socket closed. Reconnecting...");
        setTimeout(connectSocket,2000); // reconnect
      };
    };

    connectSocket();

    return ()=> ws && ws.close();

  },[]);

  // ==============================
  // 🚪 LOGOUT
  // ==============================
  const logout = ()=>{
    sessionStorage.clear();
    window.location="/";
  };

  if(!stats) return <h1 className="text-white text-center mt-20">Loading...</h1>;

  return(
    <div className="min-h-screen bg-black text-green-400 p-10">

      <h1 className="text-4xl text-center mb-8">🛡 Admin Dashboard</h1>
      <p className="text-center mb-10">Welcome Admin: {stats.admin}</p>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="border border-green-500 p-6 rounded text-center">
          <h2>Total Detections</h2>
          <p className="text-3xl">{stats.total_detections}</p>
        </div>

        <div className="border border-green-500 p-6 rounded text-center">
          <h2>Mask 😷</h2>
          <p className="text-3xl">{stats.mask_detected}</p>
        </div>

        <div className="border border-green-500 p-6 rounded text-center">
          <h2>No Mask ❌</h2>
          <p className="text-3xl">{stats.no_mask_detected}</p>
        </div>

      </div>

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-center gap-6 mb-10">

        <button
          onClick={()=>window.location="/upload"}
          className="bg-green-600 px-6 py-3 rounded"
        >
          Upload Detection
        </button>

        <button
          onClick={()=>window.location="/webcam"}
          className="bg-purple-600 px-6 py-3 rounded"
        >
          Live Webcam
        </button>

      </div>

      {/* ===== LOG TABLE ===== */}
      <h2 className="text-2xl mb-4">All Detection Logs</h2>

      <div className="overflow-auto max-h-[400px] border border-green-500">

        <table className="w-full text-sm">
          <thead className="bg-green-900">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log,index)=>(
              <tr key={index} className="text-center border-b border-green-800">
                <td>{log.email}</td>
                <td>{log.role}</td>
                <td>{log.status}</td>
                <td>{log.confidence?.toFixed(3)}</td>
                <td>{log.source}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ===== LOGOUT ===== */}
      <div className="text-center mt-8">
        <button onClick={logout} className="bg-red-600 px-6 py-2 rounded">
          Logout
        </button>
      </div>

    </div>
  )
}

export default AdminDashboard;