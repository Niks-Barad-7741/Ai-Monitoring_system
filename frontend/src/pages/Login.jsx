// import axios from "axios";
// import { useState } from "react";

// function Login(){

//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");

//   const handleLogin = async ()=>{

//     try{
//       const res = await axios.post(
//         "http://127.0.0.1:8000/auth/login",
//         {email,password}
//       );

//       sessionStorage.setItem("token", res.data.token);
//       sessionStorage.setItem("role", res.data.role);
//       sessionStorage.setItem("email", res.data.email);

//       if(res.data.role === "admin"){
//         window.location="/admin";
//       }else{
//         window.location="/user";
//       }

//     }catch{
//       alert("Invalid Login");
//     }
//   }

//   return(
//     <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white">

//       <div className="bg-[#111827] p-10 rounded-xl shadow-2xl w-96 border border-cyan-500/20">

//         <h1 className="text-3xl mb-6 text-center text-cyan-400">
//           AI Monitoring Login
//         </h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-3 mb-4 bg-black/40 border border-gray-600 rounded focus:outline-none focus:border-cyan-400"
//           onChange={(e)=>setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 mb-6 bg-black/40 border border-gray-600 rounded focus:outline-none focus:border-cyan-400"
//           onChange={(e)=>setPassword(e.target.value)}
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full py-3 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
//         >
//           Login
//         </button>

//       </div>

//     </div>
//   )
// }

// export default Login;
import axios from "axios";
import { useState } from "react";

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async ()=>{
    if(!email || !password){
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    try{
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {email,password}
      );

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      sessionStorage.setItem("email", res.data.email);

      if(res.data.role === "admin"){
        window.location="/admin";
      }else{
        window.location="/user";
      }

    }catch{
      alert("Invalid Login");
    }

    setLoading(false);
  }

  return(
    <div className="min-h-screen flex items-center justify-center px-4 
    bg-gradient-to-br from-[#070716] via-[#0b0f19] to-[#020617] text-white">

      {/* card */}
      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-lg 
      p-6 md:p-10 rounded-2xl shadow-2xl border border-cyan-500/20">

        {/* logo glow */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full 
        bg-gradient-to-r from-cyan-400 to-purple-600 blur-2xl opacity-50"></div>

        {/* title */}
        <h1 className="text-2xl md:text-3xl mb-8 text-center font-bold 
        tracking-wider text-cyan-400 drop-shadow-[0_0_12px_cyan]">
          AI Monitoring Login
        </h1>

        {/* email */}
        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 mb-4 bg-black/40 border border-gray-600 
          rounded-lg focus:outline-none focus:border-cyan-400 
          focus:shadow-[0_0_10px_cyan] transition"
          onChange={(e)=>setEmail(e.target.value)}
        />

        {/* password */}
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 mb-6 bg-black/40 border border-gray-600 
          rounded-lg focus:outline-none focus:border-cyan-400 
          focus:shadow-[0_0_10px_cyan] transition"
          onChange={(e)=>setPassword(e.target.value)}
        />

        {/* login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold tracking-wide
          bg-gradient-to-r from-cyan-500 to-blue-600 
          hover:scale-105 transition-all duration-300 shadow-lg
          ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          AI Monitoring System • Secure Access
        </p>

      </div>
    </div>
  )
}

export default Login;