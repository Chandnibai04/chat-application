import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
function ResetPassword() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/users/reset-password/${token}`,
        { password, confirmPassword }
      );

      alert(res.data.message || "Password reset successful!");
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error("Reset failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-br from-[#0a0f2c] via-[#1a103d] to-[#2a0a4a]">
      <div className="bg-[#0f0c29] p-12 rounded-lg shadow-lg w-xl max-w-3xl mx-4">
        <h2 className="text-4xl font-bold text-center text-purple-300 mb-10">
          Reset Your Password
        </h2>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-purple-200 text-xl">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-linear-to-br from-purple-600 to-indigo-600 text-white py-4 rounded-lg text-xl font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
