// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function Dashboard(){

//   const navigate = useNavigate();

//   useEffect(()=>{

//     const role = sessionStorage.getItem("role");

//     if(!role){
//       alert("Session expired login again");
//       navigate("/");
//       return;
//     }

//     // 👑 admin → admin dashboard
//     if(role === "admin"){
//       navigate("/admin");
//     }

//     // 👤 user → user dashboard
//     else{
//       navigate("/user");
//     }

//   },[]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070716] via-[#0b0b1e] to-[#050510]">

//       <div className="text-center">

//         {/* glowing logo circle */}
//         <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur-xl opacity-60"></div>

//         <h1 className="text-3xl font-bold text-white mb-4 tracking-wide">
//           Loading Dashboard
//         </h1>

//         <p className="text-gray-400">
//           Preparing your AI monitoring workspace...
//         </p>

//         {/* animated dots */}
//         <div className="flex justify-center mt-6 gap-2">
//           <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
//           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150"></div>
//           <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-300"></div>
//         </div>

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

    // admin
    if(role === "admin"){
      navigate("/admin");
    }
    // user
    else{
      navigate("/user");
    }

  },[]);

  return (

    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#070716] via-[#0b0b1e] to-[#050510] px-4">

      <div className="text-center max-w-xl w-full">

        {/* 🔵 glowing orb */}
        <div className="relative flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full 
          bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
          blur-2xl opacity-70 animate-pulse"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🤖</span>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wider mb-4">
          Loading Dashboard
        </h1>

        {/* SUB TEXT */}
        <p className="text-gray-400 text-sm sm:text-base">
          Preparing your AI monitoring workspace...
        </p>

        {/* ANIMATION DOTS */}
        <div className="flex justify-center mt-8 gap-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-300"></div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;