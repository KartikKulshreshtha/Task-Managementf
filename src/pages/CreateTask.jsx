import { useState, useEffect } from "react";
import axios from "axios";
import { serviceUrl } from "../services/url";

function CreateTask({ task, closeModal }) {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (task) {
        await axios.put(
          `${serviceUrl}/api/tasks/${task._id}`,
          { title, description },
          {
            headers: { Authorization: `${localStorage.getItem("token")}` },
          }
        );
        setSuccess("Task updated successfully!");
      } else {
        await axios.post(
          `${serviceUrl}/api/tasks`,
          { title, description },
          {
            headers: { Authorization: `${localStorage.getItem("token")}` },
          }
        );
        setSuccess("Task created successfully!");
      }

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success & Error Messages */}
      {error && (
        <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>
      )}
      {success && (
        <p className="text-green-500 bg-green-100 p-2 rounded-md">{success}</p>
      )}

      <input
        className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded-lg shadow-md flex justify-center items-center space-x-2 hover:bg-blue-700 transition-all disabled:bg-gray-400"
        disabled={loading}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0h-2a6 6 0 10-12 0H4z"
            ></path>
          </svg>
        )}
        <span>{loading ? "Saving..." : "Save Task"}</span>
      </button>
    </form>
  );
}

export default CreateTask;
