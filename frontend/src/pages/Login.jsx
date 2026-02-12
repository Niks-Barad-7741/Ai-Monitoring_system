import axios from "axios";
import { useState } from "react";

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async ()=>{

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
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white">

      <div className="bg-[#111827] p-10 rounded-xl shadow-2xl w-96 border border-cyan-500/20">

        <h1 className="text-3xl mb-6 text-center text-cyan-400">
          AI Monitoring Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-black/40 border border-gray-600 rounded focus:outline-none focus:border-cyan-400"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-black/40 border border-gray-600 rounded focus:outline-none focus:border-cyan-400"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
        >
          Login
        </button>

      </div>

    </div>
  )
}

export default Login;