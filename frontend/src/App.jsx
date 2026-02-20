import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UploadDetect from "./pages/UploadDetect";
import WebcamDetect from "./pages/WebcamDetect";
import AdminAnalytics from "./pages/AdminAnalytics";

import ProtectedRoute from "./components/ProtectedRoute";

function App(){
  return(
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>



        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
        }/>

        {/* USER */}
        <Route path="/user" element={
          <ProtectedRoute>
            <UserDashboard/>
          </ProtectedRoute>
        }/>

        {/* UPLOAD */}
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadDetect/>
          </ProtectedRoute>
        }/>

        {/* WEBCAM */}
        <Route path="/webcam" element={
          <ProtectedRoute>
            <WebcamDetect/>
          </ProtectedRoute>
        }/>

        {/* Admin Analytics */}
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AdminAnalytics/>
          </ProtectedRoute>
        }/>

      </Routes>
    </Router>
  )
}

export default App;
