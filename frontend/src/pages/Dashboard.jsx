// import { useEffect, useState } from "react";
// import axios from "axios";

// function Dashboard() {

//   const [user,setUser] = useState(null);
//   const [stats,setStats] = useState(null);

//   const token = sessionStorage.getItem("token");

//   // ===============================
//   // 🔐 GET USER DASHBOARD DATA
//   // ===============================
//   useEffect(()=>{

//     axios.get("http://127.0.0.1:8000/dashboard/user-dashboard",{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     })
//     .then(res=>{
//       setStats(res.data);
//       setUser(res.data.user);
//     })
//     .catch(err=>{
//       console.log(err);
//       alert("Session expired login again");
//       sessionStorage.clear();
//       window.location="/";
//     });

//   },[])

//   // ===============================
//   // 🚪 LOGOUT
//   // ===============================
//   const logout = ()=>{
//     sessionStorage.clear();
//     window.location="/";
//   }

//   if(!stats) return <h1 className="text-center mt-20">Loading...</h1>

//   return (
//     <div className="min-h-screen bg-black text-green-400 p-10">

//       <h1 className="text-4xl font-bold text-center mb-10">
//         🚀 AI Monitoring Dashboard
//       </h1>

//       <div className="text-center mb-10">
//         <p>Welcome: {stats.user}</p>
//       </div>

//       {/* ===================== STATS ===================== */}
//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2 className="text-xl">Total Detections</h2>
//           <p className="text-3xl">{stats.your_total_detections}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2 className="text-xl">Mask 😷</h2>
//           <p className="text-3xl">{stats.mask_detected}</p>
//         </div>

//         <div className="border border-green-500 p-6 rounded-xl text-center">
//           <h2 className="text-xl">No Mask 🚫</h2>
//           <p className="text-3xl">{stats.no_mask_detected}</p>
//         </div>

//       </div>

//       {/* ===================== ACTION BUTTONS ===================== */}
//       <div className="flex justify-center gap-6 mb-10">

//         <button className="bg-green-600 px-6 py-3 rounded">
//           📤 Upload Detection
//         </button>

//         <button className="bg-purple-600 px-6 py-3 rounded">
//           🎥 Live Webcam
//         </button>

//       </div>

//       {/* ===================== LOGOUT ===================== */}
//       <div className="text-center">
//         <button
//           onClick={logout}
//           className="bg-red-600 px-6 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//     </div>
//   );
// }

// export default Dashboard;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){

  const navigate = useNavigate();

  useEffect(()=>{

    const role = sessionStorage.getItem("role");

    if(!role){
      alert("Session expired login again");
      navigate("/");
      return;
    }

    // 👑 admin → admin dashboard
    if(role === "admin"){
      navigate("/admin");
    }

    // 👤 user → user dashboard
    else{
      navigate("/user");
    }

  },[]);

  return (
    <div className="text-green-400 text-center mt-20">
      Loading dashboard...
    </div>
  );
}

export default Dashboard;
