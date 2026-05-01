import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [projects, setProjects] = useState([]);
const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  const navigate = useNavigate();

  // 🔹 Fetch users
 useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    // fetch projects
    const resProjects = await axios.get(
      "http://localhost:5000/api/projects",
      { headers: { Authorization: token } }
    );
    setProjects(resProjects.data);

    // fetch users (already needed)
    const resUsers = await axios.get(
      "http://localhost:5000/api/auth/users"
    );
    setUsers(resUsers.data);
  };

  fetchData();
}, []);
const createTask = async () => {
  try {
    const token = localStorage.getItem("token");

    // 🔴 VALIDATION
    if (!title || !assignedTo || !projectId) {
      alert("Please fill all fields (title, user, project)");
      return;
    }

    console.log("DEBUG:", {
      title,
      assignedTo,
      projectId
    });

    await axios.post(
      "http://localhost:5000/api/tasks",
      {
        title,
        description,
        assignedTo,
        projectId,
        dueDate
      },
      {
        headers: { Authorization: token }
      }
    );

    alert("Task created!");
    window.location.href = "/dashboard-admin"; // better refresh

  } catch (err) {
    console.log(err);
    alert("Error creating task");
  }
};

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    
    {/* Card */}
    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">

      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add Task
      </h2>

      {/* Title */}
      <input
        placeholder="Title"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description */}
      <input
        placeholder="Description"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Date */}
      <input
        type="date"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* USER DROPDOWN */}
      <select
        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>

      {/* PROJECT DROPDOWN */}
      <select
        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setProjectId(e.target.value)}
      >
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p._id} value={p._id}>
            {p.title}
          </option>
        ))}
      </select>

      {/* CREATE BUTTON */}
      <button
        onClick={createTask}
        className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg text-white font-semibold"
      >
        Create Task
      </button>

      {/* BACK BUTTON */}
      <button
onClick={() =>
  navigate(role === "Admin" ? "/dashboard-admin" : "/dashboard-member")
}        className="w-full mt-3 border border-gray-600 hover:bg-gray-700 transition py-2 rounded-lg text-white"
      >
        Back to Dashboard
      </button>

    </div>
  </div>
);
}