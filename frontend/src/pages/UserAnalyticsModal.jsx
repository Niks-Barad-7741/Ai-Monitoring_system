// import { useEffect, useState } from "react";
// import axios from "axios";

// function UserAnalyticsModal({ onClose, token }) {

//   const [data,setData] = useState(null);
//   const [error,setError] = useState("");

//   // 🔥 AUTO REFRESH EVERY 3 SEC
//   useEffect(()=>{

//     const fetchAnalytics = ()=>{
//       axios.get("/user/user-analytics",{
//         headers:{ Authorization:`Bearer ${token}` }
//       })
//       .then(res=>{
//         setData(res.data);
//         setError("");
//       })
//       .catch(()=>{
//         setError("Failed to load analytics");
//       });
//     };

//     fetchAnalytics();
//     const interval = setInterval(fetchAnalytics,3000);

//     return ()=>clearInterval(interval);

//   },[token]);

//   if(!data && !error){
//     return(
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//         <div className="text-[#FFC0C1] text-lg">Loading Analytics...</div>
//       </div>
//     )
//   }

//   const maskRate = data.total>0 ? Math.round((data.mask/data.total)*100) : 0;

//   return(
//     <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4">

//       <div className="bg-[#282828] border border-[#FFC0C1]/30 rounded-2xl max-w-4xl w-full shadow-[0_0_40px_purple]">

//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-[#3a3a4a]">
//           <h2 className="text-2xl font-bold text-[#97C9DB]">👤 My Analytics</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
//         </div>

//         <div className="p-6 space-y-6">

//           {error && (
//             <div className="text-[#FFB7B2]">{error}</div>
//           )}

//           {data && (
//             <>
//               {/* Overview */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

//                 <Card title="Total" value={data.total} color="cyan"/>
//                 <Card title="Mask" value={data.mask} color="green"/>
//                 <Card title="No Mask" value={data.no_mask} color="red"/>
//                 <Card title="Webcam" value={data.webcam} color="purple"/>
//                 <Card title="Upload" value={data.upload} color="yellow"/>
//                 <Card title="Today" value={data.today} color="pink"/>

//               </div>

//               {/* Progress */}
//               <div className="bg-[#1e1e2e] p-5 rounded-xl border border-[#3a3a4a]">
//                 <div className="flex justify-between mb-2 text-sm">
//                   <span className="text-[#B5EAD7]">Mask {maskRate}%</span>
//                   <span className="text-[#FFB7B2]">No Mask {100-maskRate}%</span>
//                 </div>

//                 <div className="flex h-4 rounded-full overflow-hidden">
//                   <div className="bg-[#B5EAD7]" style={{width:`${maskRate}%`}}></div>
//                   <div className="bg-[#FFB7B2]" style={{width:`${100-maskRate}%`}}></div>
//                 </div>
//               </div>

//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default UserAnalyticsModal;

// function Card({title,value,color}){

//   const colors={
//     cyan:"border-[#97C9DB] text-[#97C9DB]",
//     green:"border-[#B5EAD7] text-[#B5EAD7]",
//     red:"border-[#FFB7B2] text-[#FFB7B2]",
//     purple:"border-[#FFC0C1] text-[#FFC0C1]",
//     yellow:"border-[#FFDAC1] text-[#FFDAC1]",
//     pink:"border-pink-500 text-pink-400"
//   }

//   return(
//     <div className={`bg-[#1e1e2e] border ${colors[color]} p-6 rounded-xl text-center`}>
//       <p className="text-gray-400 text-sm">{title}</p>
//       <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
//     </div>
//   )
// }
import { useEffect, useState } from "react";
import axios from "axios";

function UserAnalyticsModal({ onClose, token }) {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // 🔥 AUTO REFRESH EVERY 3 SEC
  useEffect(() => {

    const fetchAnalytics = () => {
      axios.get("/user/user-analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setData(res.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load analytics");
      });
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3000);

    return () => clearInterval(interval);

  }, [token]);

  if (!data && !error) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
        <div className="bg-[#282828] border border-[#FFC0C1]/30 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#97C9DB] mx-auto mb-4"></div>
          <p className="text-[#97C9DB] text-center">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const maskRate = data?.total > 0 ? Math.round((data.mask / data.total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fadeIn">

      <div className="bg-[#282828] border border-[#FFC0C1]/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.5)]">

        {/* Header */}
        <div className="sticky top-0 bg-[#282828] border-b border-[#3a3a4a] p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#97C9DB]/30 to-blue-500/30 rounded-lg flex items-center justify-center border border-[#97C9DB]/30">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#97C9DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#97C9DB]">My Analytics</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

          {error && (
            <div className="p-4 rounded-lg border border-[#FFB7B2]/30 bg-[#FFB7B2]/10 text-center">
              <p className="text-[#FFB7B2]">{error}</p>
            </div>
          )}

          {data && (
            <>
              {/* Overview Cards - Responsive Grid */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#FFC0C1] mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Detection Overview</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <Card title="Total" value={data.total} color="cyan" />
                  <Card title="Mask" value={data.mask} color="green" />
                  <Card title="No Mask" value={data.no_mask} color="red" />
                  <Card title="Webcam" value={data.webcam} color="purple" />
                  <Card title="Upload" value={data.upload} color="yellow" />
                  <Card title="Today" value={data.today} color="pink" />
                </div>
              </div>

              {/* Progress Bar - Responsive */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#FFC0C1] mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mask Compliance Rate</span>
                </h3>
                <div className="bg-[#1e1e2e] p-4 sm:p-5 lg:p-6 rounded-xl border border-[#3a3a4a]">
                  
                  {/* Stats Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#B5EAD7] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      <span className="text-sm sm:text-base text-[#B5EAD7] font-semibold">
                        Mask Detected: {maskRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FFB7B2] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                      <span className="text-sm sm:text-base text-[#FFB7B2] font-semibold">
                        No Mask: {100 - maskRate}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="flex h-6 sm:h-7 lg:h-8 rounded-full overflow-hidden shadow-inner bg-gray-900">
                      <div 
                        className="bg-[#B5EAD7] transition-all duration-500 flex items-center justify-center relative group" 
                        style={{ width: `${maskRate}%` }}
                      >
                        {maskRate > 10 && (
                          <span className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">
                            {maskRate}%
                          </span>
                        )}
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
                      </div>
                      <div 
                        className="bg-[#FFB7B2] transition-all duration-500 flex items-center justify-center relative group" 
                        style={{ width: `${100 - maskRate}%` }}
                      >
                        {(100 - maskRate) > 10 && (
                          <span className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">
                            {100 - maskRate}%
                          </span>
                        )}
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <div className="mt-4 sm:mt-5 pt-4 border-t border-[#3a3a4a]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      {maskRate >= 80 ? (
                        <>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#B5EAD7] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm sm:text-base text-[#B5EAD7] font-semibold">Excellent Compliance!</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">You're doing a great job maintaining mask safety.</p>
                          </div>
                        </>
                      ) : maskRate >= 50 ? (
                        <>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFDAC1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <p className="text-sm sm:text-base text-[#FFDAC1] font-semibold">Good, But Room for Improvement</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Try to wear your mask more consistently.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB7B2] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm sm:text-base text-[#FFB7B2] font-semibold">Low Compliance Detected</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Please remember to wear your mask for safety.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Auto-refresh indicator */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 pb-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97C9DB] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#97C9DB]"></span>
                </div>
                <span>Auto-refreshing every 3 seconds</span>
              </div>

            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserAnalyticsModal;

function Card({ title, value, color }) {

  const colors = {
    cyan: "border-[#97C9DB] text-[#97C9DB] shadow-[#97C9DB]/20",
    green: "border-[#B5EAD7] text-[#B5EAD7] shadow-green-500/20",
    red: "border-[#FFB7B2] text-[#FFB7B2] shadow-red-500/20",
    purple: "border-[#FFC0C1] text-[#FFC0C1] shadow-[#FFC0C1]/20",
    yellow: "border-[#FFDAC1] text-[#FFDAC1] shadow-yellow-500/20",
    pink: "border-[#FFC0C1] text-[#FFC0C1] shadow-[#FFC0C1]/20"
  };

  const glowColors = {
    cyan: "hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
    green: "hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]",
    red: "hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    purple: "hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    yellow: "hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]",
    pink: "hover:shadow-xl"
  };

  return (
    <div className={`bg-[#1e1e2e] border ${colors[color]} p-4 sm:p-5 lg:p-6 rounded-xl text-center transition-all duration-300 ${glowColors[color]} hover:scale-105 cursor-default`}>
      <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">{title}</p>
      <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colors[color]}`}>{value ?? 0}</p>
    </div>
  );
}