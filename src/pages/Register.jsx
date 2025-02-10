import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { serviceUrl } from "../services/url";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`${serviceUrl}/api/auth/register`, { email, password, role });
      setMessage({ type: "success", text: "Registration successful! Redirecting..." });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 animate-fadeIn"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create an Account</h2>

        {message.text && (
          <div
            className={`text-center p-2 mb-4 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="relative">
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <select
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300 cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Regular User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          className="w-full p-3 bg-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-green-600 hover:shadow-md"
          type="submit"
        >
          Register
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-green-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
