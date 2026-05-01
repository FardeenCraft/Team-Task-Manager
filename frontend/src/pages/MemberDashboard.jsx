import { useEffect, useState } from "react";
import axios from "axios";

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const user = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
  const userId = user.id;

  // 🔥 FETCH
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const resTasks = await axios.get(
        "http://localhost:5000/api/tasks",
        { headers: { Authorization: token } }
      );

      const resProjects = await axios.get(
        "http://localhost:5000/api/projects",
        { headers: { Authorization: token } }
      );

      setTasks(resTasks.data);
      setProjects(resProjects.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 OVERDUE COUNT
  const overdueCount = tasks.filter(
    t =>
      new Date(t.dueDate) < new Date() &&
      t.status !== "Done" &&
      t.assignedTo?.toString() === userId.toString()
  ).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-2">My Projects</h2>

      {/* 🔥 OVERDUE DISPLAY */}
      <p className="text-red-400 mb-6">
        Overdue Tasks: {overdueCount}
      </p>

      {projects.length === 0 ? (
        <p className="text-gray-400">No assigned projects</p>
      ) : (
        <div className="grid gap-6">

          {projects.map(project => {

            const projectTasks = tasks.filter(
              t =>
                t.projectId?.toString() === project._id.toString() &&
                t.assignedTo?.toString() === userId.toString()
            );

            return (
              <div
                key={project._id}
                className="bg-gray-800 p-5 rounded-xl"
              >

                {/* PROJECT */}
                <h3 className="text-lg font-semibold">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm mb-3">
                  {project.description}
                </p>

                {/* TASKS */}
                {projectTasks.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    No tasks assigned
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {projectTasks.map(task => {

                      // 🔥 OVERDUE LOGIC
                      const isOverdue =
                        new Date(task.dueDate) < new Date() &&
                        task.status !== "Done";

                      return (
                        <li
                          key={task._id}
                          className={`p-3 rounded-lg flex flex-col gap-1 ${
                            isOverdue
                              ? "bg-red-900 border border-red-500"
                              : "bg-gray-700"
                          }`}
                        >

                          {/* TITLE */}
                          <div className="font-medium">
                            {task.title}
                          </div>

                          {/* ASSIGNED */}
                          <div className="text-xs text-blue-400">
                            Assigned by: {task.assignedUserName || "Admin"}
                          </div>

                          {/* DUE */}
                          <div className="text-xs text-gray-400">
                            Due: {new Date(task.dueDate).toDateString()}
                          </div>

                          {/* 🔥 OVERDUE LABEL */}
                          {isOverdue && (
                            <div className="text-xs text-red-400 font-semibold">
                              ⚠ Overdue
                            </div>
                          )}

                          {/* STATUS + BUTTON */}
                          <div className="flex justify-between items-center mt-1">

                            <span
                              className={
                                task.status === "Done"
                                  ? "text-green-400 text-xs"
                                  : isOverdue
                                  ? "text-red-400 text-xs"
                                  : "text-yellow-400 text-xs"
                              }
                            >
                              {task.status}
                            </span>

                            {task.status !== "Done" && (
                              <button
                                className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
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
                                  fetchData();
                                }}
                              >
                                Mark Done
                              </button>
                            )}

                          </div>

                        </li>
                      );
                    })}
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