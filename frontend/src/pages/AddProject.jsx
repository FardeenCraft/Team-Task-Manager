import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/users`);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  // CREATE PROJECT
  const createProject = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!title) {
        alert("Title is required");
        return;
      }

      await axios.post(
        `${API}/api/projects`,
        {
          title,
          description,
          teamMembers: selectedMembers
        },
        {
          headers: { Authorization: token }
        }
      );

      alert("Project created");
      navigate("/dashboard-admin", { state: { refresh: true } });

    } catch (err) {
      console.log(err);
      alert("Error creating project");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add Project
        </h2>

        {/* TITLE */}
        <input
          placeholder="Project Title"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <input
          placeholder="Project Description"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* MEMBERS */}
        <label className="text-sm text-gray-400 mb-1 block">
          Assign Members
        </label>

        <select
          multiple
          className="w-full mb-4 bg-gray-700 text-white p-2 rounded-lg h-32"
          onChange={(e) =>
            setSelectedMembers(
              Array.from(e.target.selectedOptions, option => option.value)
            )
          }
        >
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        {/* CREATE BUTTON */}
        <button
          onClick={createProject}
          className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded-lg text-white font-semibold"
        >
          Create Project
        </button>

        {/* BACK BUTTON */}
        <button
          onClick={() =>
            navigate(
              role === "Admin"
                ? "/dashboard-admin"
                : "/dashboard-member"
            )
          }
          className="w-full mt-3 border border-gray-600 hover:bg-gray-700 transition py-2 rounded-lg text-white"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}