import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();

    if(!email || !password){
      toast.error("Enter email & password");
      return;
    }

    setLoading(true);

    try{
      const res = await axios.post(
        "/auth/login",
        {email,password}
      );

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("refreshToken", res.data.refresh_token);
      sessionStorage.setItem("role", res.data.role);
      sessionStorage.setItem("email", res.data.email);

      toast.success("Login Successful", { position: "top-center" });

      if(res.data.role === "admin"){
        navigate("/admin");
      }else{
        navigate("/user");
      }

    }catch(error){
      const errorMsg = error.response?.data?.detail || "Invalid Login";
      toast.error(errorMsg);
    }finally{
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin(e);
    }
  };

  return(
    <div className="min-h-screen flex items-center justify-center 
    px-4 sm:px-6 lg:px-8 py-8 sm:py-12
    bg-[#1e1e2e] text-white">

      {/* Login Card */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg 
      bg-[#282828] 
      p-6 sm:p-8 md:p-10 lg:p-12
      rounded-2xl shadow-2xl border border-[#3a3a4a]
      hover:border-[#FFC0C1]/40 transition-all duration-300">

        {/* Logo Glow */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
        mx-auto mb-6 sm:mb-8 
        rounded-full 
        bg-gradient-to-r from-[#FFC0C1] to-[#97C9DB] 
        blur-2xl opacity-40 animate-pulse"></div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl
        mb-6 sm:mb-8 
        text-center font-bold 
        tracking-wide sm:tracking-wider 
        text-[#FFC0C1]">
          AI Monitoring Login
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} onKeyPress={handleKeyPress} autoComplete="off">
          
          {/* Email Input */}
          <div className="mb-4 sm:mb-5">
            <label 
              htmlFor="email" 
              className="block text-sm sm:text-base text-gray-300 mb-2 font-medium"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email-field"
              type="email"
              placeholder="your.email@gmail.com"
              value={email}
              className="w-full 
              px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5
              text-sm sm:text-base
              text-white
              bg-[#1e1e2e] 
              border border-[#3a3a4a] 
              rounded-lg 
              focus:outline-none 
              focus:border-[#97C9DB] 
              focus:ring-2 focus:ring-[#97C9DB]/30
              transition-all duration-300
              placeholder:text-gray-500"
              onChange={(e)=>setEmail(e.target.value)}
              disabled={loading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 sm:mb-8">
            <label 
              htmlFor="password" 
              className="block text-sm sm:text-base text-gray-300 mb-2 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password-field"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                className="w-full 
                px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5
                text-sm sm:text-base
                text-white
                bg-[#1e1e2e] 
                border border-[#3a3a4a] 
                rounded-lg 
                focus:outline-none 
                focus:border-[#97C9DB] 
                focus:ring-2 focus:ring-[#97C9DB]/30
                transition-all duration-300
                placeholder:text-gray-500
                pr-12"
                onChange={(e)=>setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              
              {/* Show/Hide Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-[#97C9DB] 
                transition-colors duration-200
                focus:outline-none focus:text-[#97C9DB]"
                disabled={loading}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Login Button — MLU-Explain flat pastel style */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full 
            py-2.5 sm:py-3 md:py-3.5
            text-sm sm:text-base md:text-lg
            rounded-lg font-semibold tracking-wide
            bg-[#FFC0C1] text-[#1e1e2e]
            border-2 border-[#1e1e2e]
            hover:bg-[#ffb0b1] hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-[#FFC0C1]/50
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl"}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#3a3a4a]"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 sm:px-4 bg-[#282828] text-gray-400">or</span>
          </div>
        </div>

        {/*  Forgot Password Link */}
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="w-full text-center text-xs sm:text-sm text-[#97C9DB] 
          hover:text-[#b0dae8] transition-colors duration-200
          focus:outline-none focus:underline mb-4"
          disabled={loading}
        >
          Forgot your password?
        </button>

        {/*  Register Link */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
              className="text-[#97C9DB] hover:text-[#b0dae8] font-medium transition-colors duration-200 focus:outline-none focus:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            AI Monitoring System
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Secure Access • Protected by Encryption
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login;