import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  const navigate = useNavigate();

  const signup = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
          role
        }
      );

      alert("Signup successful");
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      
      {/* Card */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80">
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Signup
        </h2>

        {/* Name */}
        <input
          placeholder="Name"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role Dropdown */}
        <select
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Signup Button */}
        <button
          onClick={signup}
          className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded-lg text-white font-semibold"
        >
          Signup
        </button>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 border border-gray-600 hover:bg-gray-700 transition py-2 rounded-lg text-white"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}