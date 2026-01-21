import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket/socket"; // 🔹 added this


function Signup() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      "https://localhost:5000/api/users/signup",
      { username, email, phone, password, confirmPassword }
    );

    console.log("Signup success:", res.data);

    if (res.data.token) {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userId", res.data.user.id);
      sessionStorage.setItem("userName", res.data.user.name);

      // 🔹 Emit new user to socket server
      socket.emit("newUser", res.data.user);
    }

    navigate("/login"); // or redirect to chat page
  } catch (err) {
    console.error("Signup failed:", err.response?.data || err.message);
    alert(err.response?.data?.error || "Signup failed!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-linear-to-br from-[#0a0f2c] via-[#1a103d] to-[#2a0a4a]">
      <div className="bg-[#0f0c29] p-12 rounded-lg shadow-lg w-xl
       max-w-3xl mx-4">
        <h2 className="text-4xl font-bold text-center text-purple-300 mb-10">
          Create Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg text-xl font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-purple-300 text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
