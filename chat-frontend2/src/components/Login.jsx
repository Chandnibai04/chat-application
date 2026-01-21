import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) { // accept onLogin prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend login API
      const res = await axios.post(
        "https://localhost:5000/api/users/login",
        { emailOrPhone: username, password }
      );

      if (res.data.token) {
        // Save session data
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("username", res.data.user.name);
        sessionStorage.setItem("userId", res.data.user.id);

        // Inform App that user is logged in
        if (onLogin) onLogin();

        // Navigate to chat or home page
        navigate("/chat");
      } else {
        alert("Login failed: no token returned");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] via-[#1a103d] to-[#2a0a4a]">
      <div className="bg-[#0f0c29] p-12 rounded-lg shadow-lg w-144 max-w-3xl mx-4">
        <h2 className="text-4xl font-bold text-center text-purple-300 mb-10">
          Secure Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Username / Email / Phone</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username, email, or phone"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <p className="text-right text-purple-300 text-sm mt-1">
            <Link
              to="/forgot-password"
              className="text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg text-xl font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-purple-300 text-lg">
          Not registered?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
