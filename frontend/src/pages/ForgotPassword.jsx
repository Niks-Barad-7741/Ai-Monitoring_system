import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  // Step 1: verify email exists
  // Step 2: enter new password
  const [step,            setStep]            = useState(1);
  const [email,           setEmail]           = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");

  const navigate = useNavigate();

  // ── Step 1: verify email ────────────────────────────────
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/auth/verify-email", { email: email.trim().toLowerCase() });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Email not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: reset password ──────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/auth/reset-password", {
        email:        email.trim().toLowerCase(),
        new_password: newPassword
      });

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-10">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 tracking-widest drop-shadow-[0_0_15px_purple]">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm mt-2">AI Monitoring System</p>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className={`flex items-center gap-2 flex-1`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
              ${step >= 1 ? "bg-purple-600 border-purple-500 text-white" : "border-gray-700 text-gray-600"}`}>
              {step > 1 ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
              ) : "1"}
            </div>
            <span className={`text-xs font-medium ${step >= 1 ? "text-purple-300" : "text-gray-600"}`}>Verify Email</span>
          </div>
          <div className={`h-px flex-1 ${step >= 2 ? "bg-purple-500/50" : "bg-gray-700"} transition-colors`} />
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className={`text-xs font-medium ${step >= 2 ? "text-purple-300" : "text-gray-600"}`}>New Password</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
              ${step >= 2 ? "bg-purple-600 border-purple-500 text-white" : "border-gray-700 text-gray-600"}`}>
              2
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-[#0b1120]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)]">

          {/* ══ STEP 1: Verify Email ══ */}
          {step === 1 && (
            <form onSubmit={handleVerifyEmail} className="flex flex-col gap-5">
              <div>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Enter your registered email address and we'll verify your account before allowing a password reset.
                </p>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium tracking-wide">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@gmail.com"
                    required
                    className="w-full pl-9 pr-4 py-3 bg-[#020617] border border-gray-700 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition flex items-center justify-center gap-2
                  ${loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20"}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Verifying...
                  </>
                ) : "Verify Email"}
              </button>
            </form>
          )}

          {/* ══ STEP 2: New Password ══ */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="p-3 rounded-xl border border-green-500/30 bg-green-500/10 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <p className="text-green-400 text-sm">Email verified — <span className="font-mono text-xs">{email}</span></p>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium tracking-wide">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(""); }}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full pl-9 pr-10 py-3 bg-[#020617] border border-gray-700 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                    {showNew ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium tracking-wide">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-9 pr-10 py-3 bg-[#020617] border border-gray-700 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                    {showConfirm ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-xs mt-1.5 flex items-center gap-1 ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                    {newPassword === confirmPassword ? (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Passwords match</>
                    ) : (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>Passwords do not match</>
                    )}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl border border-green-500/40 bg-green-500/10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); setNewPassword(""); setConfirmPassword(""); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-700 text-gray-400 hover:bg-white/5 hover:text-white transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm tracking-wide transition flex items-center justify-center gap-2
                    ${loading
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20"}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Resetting...
                    </>
                  ) : "Reset Password"}
                </button>
              </div>
            </form>
          )}

          {/* ── Footer ── */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Remember your password?{" "}
              <button onClick={() => navigate("/")} className="text-purple-400 hover:text-purple-300 font-medium transition">
                Sign In
              </button>
            </p>
          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-6">AI Monitoring System · Secure Access · Protected by Encryption</p>
      </div>
    </div>
  );
}

export default ForgotPassword;