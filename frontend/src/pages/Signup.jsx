import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  const navigate = useNavigate();

  const signup = async () => {
    try {
      if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
      }

      await axios.post(
        `${API}/api/auth/signup`,   // ✅ FIXED
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
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80">
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Signup
        </h2>

        {/* Name */}
        <input
          placeholder="Name"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role */}
        <select
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Signup */}
        <button
          onClick={signup}
          className="w-full bg-green-600 py-2 rounded-lg text-white font-semibold"
        >
          Signup
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 border border-gray-600 py-2 rounded-lg text-white"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}