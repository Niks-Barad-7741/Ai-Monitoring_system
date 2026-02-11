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

      console.log(res.data);   // 👈 see token in console

      // 🔥 SAVE TOKEN
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      sessionStorage.setItem("email", res.data.email);

      alert("Login Success 🚀");
      if(res.data.role === "admin"){
            window.location="/admin";
        }else{
            window.location="/user"
        }

    }catch(err){
      alert("Invalid Login");
    }
  }

  return(
    <div className="min-h-screen flex justify-center items-center bg-black text-green-400">

      <div className="border border-green-500 p-8 rounded-xl w-96">
        <h1 className="text-2xl mb-6 text-center">🔐 AI Monitoring Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 mb-4 bg-black border border-green-500"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 mb-4 bg-black border border-green-500"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 p-3 rounded"
        >
          Login
        </button>

      </div>
    </div>
  )
}

export default Login;