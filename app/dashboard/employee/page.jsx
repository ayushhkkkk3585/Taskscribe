"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, LogOut, Calendar, Briefcase } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const tasksPerPage = 6;
  const offset = currentPage * tasksPerPage;
  const currentTasks = tasks.slice(offset, offset + tasksPerPage);
  const pageCount = Math.ceil(tasks.length / tasksPerPage);

  // card colors
  const pastelColors = [
    "bg-pink-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-indigo-50",
    "bg-teal-50",
  ];

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline set";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const decoded = parseJwt(token);
    if (!decoded || decoded.role !== "employee")
      return router.push("/dashboard/manager");

    setUser({ id: decoded.id, role: decoded.role });

    fetch(`/api/tasks?assignedTo=${decoded.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (loading)
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-gray-200 h-48"
          ></div>
        ))}
      </div>
    );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-700">
            Employee Dashboard
          </h1>
          <h2 className="text-lg text-gray-600 mt-1">
            👋 Welcome,{" "}
            <span className="font-semibold text-gray-800">
              {user?.name || user?.role}
            </span>
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-xl shadow-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-lg italic">No tasks assigned 🚀</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentTasks.map((task, index) => (
              <div
                key={task._id}
                className={`${pastelColors[index % pastelColors.length]} p-6 rounded-2xl shadow-md hover:shadow-lg transition`}
              >
                {/* Title */}
                <h3 className="text-lg font-bold text-indigo-700">
                  {task.title}
                </h3>
                <p className="mt-2 text-gray-700 text-sm">{task.description}</p>

                {/* Task details */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} className="text-blue-500" />
                    <span>
                      <span className="font-medium">Meeting:</span>{" "}
                      {task.meetingId?.title || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-green-500" />
                    <span>
                      <span className="font-medium">Deadline:</span>{" "}
                      <span
                        className={`${
                          task.deadline && new Date(task.deadline) < new Date()
                            ? "text-red-600 font-medium"
                            : "text-gray-900"
                        }`}
                      >
                        {formatDate(task.deadline)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClipboardCheck
                      size={16}
                      className={
                        task.status === "completed"
                          ? "text-green-600"
                          : "text-orange-500"
                      }
                    />
                    <span>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`${
                          task.status === "completed"
                            ? "text-green-600"
                            : "text-orange-600"
                        } font-medium`}
                      >
                        {task.status}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Complete button */}
                {task.status !== "completed" && (
                  <button
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition-colors text-sm"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      try {
                        await fetch(`/api/tasks/${task._id}/complete`, {
                          method: "PATCH",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setTasks(
                          tasks.map((t) =>
                            t._id === task._id
                              ? { ...t, status: "completed" }
                              : t
                          )
                        );
                      } catch (error) {
                        console.error("Failed to update task:", error);
                      }
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex gap-3 text-sm"}
              pageClassName={
                "px-3 py-1 border rounded-md hover:bg-gray-100 transition"
              }
              activeClassName={"bg-black text-white"}
              previousClassName={
                "px-3 py-1 border rounded-md hover:bg-gray-100"
              }
              nextClassName={"px-3 py-1 border rounded-md hover:bg-gray-100"}
            />
          </div>
        </>
      )}
    </div>
  );
}
