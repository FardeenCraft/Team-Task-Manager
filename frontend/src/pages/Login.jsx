import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Member");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,   // ✅ FIXED
        { email, password }
      );

      // 🔐 ROLE CHECK
      if (res.data.user.role !== selectedRole) {
        alert(`You are not registered as ${selectedRole}`);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "Admin") {
        navigate("/dashboard-admin");
      } else {
        navigate("/dashboard-member");
      }

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        {/* ROLE SELECT */}
        <div className="flex mb-4 bg-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setSelectedRole("Admin")}
            className={`w-1/2 py-2 ${
              selectedRole === "Admin" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Admin
          </button>

          <button
            onClick={() => setSelectedRole("Member")}
            className={`w-1/2 py-2 ${
              selectedRole === "Member" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Member
          </button>
        </div>

        {/* Email */}
        <input
          type="email"
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

        <button
          onClick={login}
          className="w-full bg-blue-600 py-2 rounded-lg text-white"
        >
          Login as {selectedRole}
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-3 border border-gray-600 py-2 rounded-lg text-white"
        >
          Go to Signup
        </button>

      </div>
    </div>
  );
}