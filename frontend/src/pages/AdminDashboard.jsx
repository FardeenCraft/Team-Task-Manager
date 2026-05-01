import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  // ✅ Moved outside useEffect
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const resTasks = await axios.get(
        "http://localhost:5000/api/tasks",
        { headers: { Authorization: token } }
      );
      setTasks(resTasks.data);

      const resProjects = await axios.get(
        "http://localhost:5000/api/projects",
        { headers: { Authorization: token } }
      );
      setProjects(resProjects.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Done").length;
  const overdue = tasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== "Done"
  ).length;

  const completedProjects = projects.filter(p => p.completed).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>

        <button
          onClick={() => navigate("/add-project")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          + Add Project
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Completed Projects</p>
          <h3 className="text-blue-400 text-xl font-bold">
            {completedProjects}
          </h3>
        </div>

      </div>

      {/* PROJECTS */}
      <h3 className="text-2xl font-semibold mb-4">Projects</h3>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {projects.map(project => {

            const projectTasks = tasks.filter(
              t => t.projectId?.toString() === project._id.toString()
            );

            return (
              <div
                key={project._id}
                className={`bg-gray-800 border border-gray-700 rounded-xl p-5 ${
                  project.completed ? "opacity-50 line-through" : ""
                }`}
              >

                {/* Project Title */}
                <h3 className="text-lg font-semibold">
                  {project.title}
                </h3>

                {/* 🔥 DELETE PROJECT */}
                <button
                  className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded mb-2"
                  onClick={async () => {
                    if (!window.confirm("Delete this project?")) return;

                    try {
                      await axios.delete(
                        `http://localhost:5000/api/projects/${project._id}`,
                        {
                          headers: {
                            Authorization: localStorage.getItem("token")
                          }
                        }
                      );

                      fetchData(); // ✅ refresh UI
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  Delete Project
                </button>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-2">
                  {project.description}
                </p>

                {/* ADD TASK BUTTON */}
                <button
                  onClick={() => navigate(`/add-task?projectId=${project._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-2 py-1 text-xs rounded mb-2"
                >
                  + Add Task
                </button>

                {/* PROJECT COMPLETION */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={project.completed || false}
                    onChange={async () => {
                      await axios.patch(
                        `http://localhost:5000/api/projects/${project._id}`,
                        { completed: !project.completed },
                        {
                          headers: {
                            Authorization: localStorage.getItem("token")
                          }
                        }
                      );

                      fetchData(); // ✅ refresh UI
                    }}
                  />
                  <span className="text-xs text-gray-400">
                    Mark Completed
                  </span>
                </div>

                {/* TASKS */}
                <h4 className="text-yellow-400 text-sm font-semibold mb-2">
                  Tasks:
                </h4>

                {projectTasks.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    No tasks yet
                  </p>
                ) : (
                  <ul className="list-disc pl-5 space-y-3">
                    {projectTasks.map(task => (
                      <li
                        key={task._id}
                        className="text-sm text-gray-200 bg-gray-700 p-3 rounded-lg flex flex-col gap-1"
                      >

                        {/* Task Title */}
                        <div className="font-medium">
                          {task.title}
                        </div>

                        {/* Assigned User */}
                        <div className="text-xs text-blue-400">
                          Assigned to: {task.assignedUserName || task.assignedTo}
                        </div>

                        {/* Status + Buttons */}
                        <div className="flex justify-between items-center mt-1">

                          {/* Status */}
                          <span
                            className={
                              task.status === "Done"
                                ? "text-green-400 text-xs"
                                : "text-yellow-400 text-xs"
                            }
                          >
                            {task.status}
                          </span>

                          <div className="flex gap-2">

                            {/* MARK DONE */}
                            {task.status !== "Done" && (
                              <button
                                className="text-xs bg-green-600 px-2 py-1 rounded"
                                onClick={async () => {
                                  await axios.patch(
                                    `http://localhost:5000/api/tasks/${task._id}`,
                                    { status: "Done" },
                                    {
                                      headers: {
                                        Authorization: localStorage.getItem("token")
                                      }
                                    }
                                  );

                                  fetchData(); // ✅ refresh UI
                                }}
                              >
                                Done
                              </button>
                            )}

                            {/* DELETE TASK */}
                            <button
                              className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                              onClick={async () => {
                                if (!window.confirm("Delete this task?")) return;

                                await axios.delete(
                                  `http://localhost:5000/api/tasks/${task._id}`,
                                  {
                                    headers: {
                                      Authorization: localStorage.getItem("token")
                                    }
                                  }
                                );

                                fetchData(); // ✅ refresh UI
                              }}
                            >
                              Delete
                            </button>

                          </div>
                        </div>

                      </li>
                    ))}
                  </ul>
                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}