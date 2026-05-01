import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function AddTask() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔹 Fetch projects + users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        //  Fetch projects
        const resProjects = await axios.get(
          `${API}/api/projects`,
          { headers: { Authorization: token } }
        );
        setProjects(resProjects.data);

        // ✅ Fetch users
        const resUsers = await axios.get(
          `${API}/api/auth/users`
        );
        setUsers(resUsers.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // 🔹 Create Task
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!title || !assignedTo || !projectId) {
        alert("Please fill all fields (title, user, project)");
        return;
      }

      await axios.post(
        `${API}/api/tasks`,
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
      navigate("/dashboard-admin");

    } catch (err) {
      console.log(err);
      alert("Error creating task");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
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

        {/* User Dropdown */}
        <select
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white"
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        {/* Project Dropdown */}
        <select
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white"
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Create Button */}
        <button
          onClick={createTask}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg text-white font-semibold"
        >
          Create Task
        </button>

        {/* Back Button */}
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