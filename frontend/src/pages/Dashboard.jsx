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

//     // admin
//     if(role === "admin"){
//       navigate("/admin");
//     }
//     // user
//     else{
//       navigate("/user");
//     }

//   },[]);

//   return (

//     <div className="min-h-screen flex items-center justify-center 
//     bg-gradient-to-br from-[#070716] via-[#0b0b1e] to-[#050510] px-4">

//       <div className="text-center max-w-xl w-full">

//         {/* 🔵 glowing orb */}
//         <div className="relative flex justify-center mb-8">
//           <div className="w-24 h-24 rounded-full 
//           bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
//           blur-2xl opacity-70 animate-pulse"></div>

//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-3xl">🤖</span>
//           </div>
//         </div>

//         {/* TITLE */}
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wider mb-4">
//           Loading Dashboard
//         </h1>

//         {/* SUB TEXT */}
//         <p className="text-gray-400 text-sm sm:text-base">
//           Preparing your AI monitoring workspace...
//         </p>

//         {/* ANIMATION DOTS */}
//         <div className="flex justify-center mt-8 gap-3">
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

  },[navigate]);

  return (

    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#070716] via-[#0b0b1e] to-[#050510] 
    px-4 sm:px-6 lg:px-8 py-8">

      <div className="text-center max-w-xl w-full">

        {/* 🔵 glowing orb - responsive sizing */}
        <div className="relative flex justify-center mb-6 sm:mb-8 lg:mb-10">
          
          {/* Glow effect - scales with screen size */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 
          rounded-full 
          bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
          blur-2xl opacity-70 animate-pulse"></div>

          {/* Robot emoji - scales with screen size */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">𖠌</span>
          </div>
        </div>

        {/* TITLE - smooth progression across breakpoints */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
        font-bold text-white tracking-wide sm:tracking-wider 
        mb-3 sm:mb-4 lg:mb-6 
        px-2 sm:px-0">
          Loading Dashboard
        </h1>

        {/* SUB TEXT - responsive sizing */}
        <p className="text-gray-400 text-sm sm:text-base md:text-lg 
        px-4 sm:px-6 lg:px-0 
        leading-relaxed">
          Preparing your AI monitoring workspace...
        </p>

        {/* ANIMATION DOTS - responsive sizing and spacing */}
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10 gap-2 sm:gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 
          bg-cyan-400 rounded-full animate-bounce"></div>
          
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 
          bg-purple-500 rounded-full animate-bounce 
          [animation-delay:150ms]"></div>
          
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 
          bg-pink-500 rounded-full animate-bounce 
          [animation-delay:300ms]"></div>
        </div>

        {/* Optional: Loading progress text */}
        <p className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 
        animate-pulse px-4">
          Redirecting to your dashboard...
        </p>

      </div>

    </div>
  );
}

export default Dashboard;