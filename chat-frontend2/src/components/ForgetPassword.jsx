  import { useState } from "react";
  import { Link } from "react-router-dom";
  import axios from "axios";

  function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
        const res = await axios.post(
          "https://localhost:5000/api/users/forgot-password",
          { email }
        );

        setMessage(res.data.message || "Check your email for reset instructions");
      } catch (err) {
        console.error("Forgot password error:", err.response?.data || err.message);
        setMessage(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="h-screen w-screen flex items-center justify-center bg-linear-to-br from-[#0a0f2c] via-[#1a103d] to-[#2a0a4a]">
        <div className="bg-[#0f0c29] p-12 rounded-lg shadow-lg w-xl max-w-3xl mx-4">
          <h2 className="text-4xl font-bold text-center text-purple-300 mb-10">
            Forgot Password
          </h2>

          {message && (
            <p className="text-center mb-6 text-green-400">{message}</p>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="flex items-center gap-2">
              <label className="w-32 text-purple-200 text-xl">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#020617] text-white text-lg px-6 py-3 rounded-lg border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg text-xl font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center mt-6 text-purple-300 text-lg">
            Remembered your password?{" "}
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

  export default ForgotPassword;
