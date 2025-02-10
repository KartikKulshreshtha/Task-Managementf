import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import CreateTask from "./CreateTask";
import { serviceUrl } from "../services/url";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    } else {
      navigate("/");
    }
    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setError(message);
    } else {
      setSuccessMessage(message);
    }
    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 3000);
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${serviceUrl}/api/tasks`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setTasks(response.data);
    } catch (error) {
      showMessage("Failed to load tasks. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${serviceUrl}/api/tasks/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        fetchTasks();
        showMessage("Task deleted successfully.");
      } catch (error) {
        showMessage("Failed to delete task.", "error");
      }
    }
  };

  const canManageTask = (task) => {
    return userRole === "admin" || task.userId === userId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📋 Task Dashboard
        </h1>

        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            onClick={() => {
              setEditTask(null);
              setShowModal(true);
            }}
          >
            ➕ Create Task
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading tasks...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tasks
            .filter((task) => userRole === "admin" || task.userId === userId)
            .map((task) => (
              <div
                key={task._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-100"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {task.description || "No description provided"}
                </p>
                {task.userId !== userId && userRole === "admin" && (
                  <p className="text-blue-600 text-xs mt-2">
                    👤 Task owned by another user
                  </p>
                )}
                <div className="mt-4 flex justify-between">
                  {canManageTask(task) && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded shadow-md hover:bg-green-600"
                        onClick={() => {
                          setEditTask(task);
                          setShowModal(true);
                        }}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded shadow-md hover:bg-red-600"
                        onClick={() => handleDelete(task._id)}
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>

        {!loading && tasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No tasks available. 🎉
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {editTask ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <CreateTask
              task={editTask}
              closeModal={() => {
                setShowModal(false);
                fetchTasks();
                showMessage(
                  editTask
                    ? "Task updated successfully."
                    : "Task created successfully."
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;