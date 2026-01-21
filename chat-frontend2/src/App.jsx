import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgetPassword"; // for entering email
import ResetPassword from "./components/ResetPassword"; // for new password via token
import ChatApp from "./components/ChatApp";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  return (
    <Routes>
      {/* Home / Login */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/chat" />
          ) : (
            <Login onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/chat" />
          ) : (
            <Login onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      {/* Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* Forgot Password - enter email */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Reset Password - token from email link */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected ChatApp */}
      <Route
        path="/chat"
        element={isLoggedIn ? <ChatApp /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
