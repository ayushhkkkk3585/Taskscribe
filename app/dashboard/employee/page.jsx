"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, LogOut, Calendar, Briefcase } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setName(storedUser?.name || "");

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
    localStorage.removeItem("user");
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

  // Calculate metrics
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  // Find upcoming deadline
  const upcomingDeadlines = tasks
    .filter(task => task.status !== "completed" && task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const nextDeadline = upcomingDeadlines.length > 0 ? formatDate(upcomingDeadlines[0].deadline) : "No upcoming deadlines";

  return (
    <div className="min-h-screen p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-700">
            Employee Dashboard
          </h1>
          <h2 className="text-lg text-gray-600 mt-1">
            👋 Welcome, <span className="font-semibold text-gray-800">{name}</span>
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-xl shadow-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Total Tasks</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-teal-700">{tasks.length}</span>
            <Briefcase className="ml-auto text-teal-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Completed</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-green-600">{completedTasks}</span>
            <ClipboardCheck className="ml-auto text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Pending</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-orange-600">{pendingTasks}</span>
            <Calendar className="ml-auto text-orange-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Completion Rate</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
            <div className="ml-auto w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center" 
                style={{
                  background: `conic-gradient(#3b82f6 ${completionRate}%, #f3f4f6 0)`
                }}
              >
                <div className="h-6 w-6 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-xl border border-teal-100 shadow-sm">
        <h3 className="text-sm font-medium text-teal-700 mb-1">Next Deadline</h3>
        <p className="text-gray-700">{nextDeadline}</p>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-lg italic">No tasks assigned 🚀</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentTasks.map((task, index) => {
              // Check if deadline is past
              const isPastDeadline = task.deadline && new Date(task.deadline) < new Date();
              // Calculate time remaining until deadline for uncompleted tasks
              let timeRemaining = '';
              if (task.deadline && task.status !== "completed") {
                const deadlineDate = new Date(task.deadline);
                const now = new Date();
                const diffTime = deadlineDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffTime < 0) {
                  timeRemaining = `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'} overdue`;
                } else if (diffDays === 0) {
                  timeRemaining = 'Due today';
                } else {
                  timeRemaining = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} remaining`;
                }
              }

              return (
                <div
                  key={task._id}
                  className={`relative overflow-hidden bg-white border ${
                    task.status === "completed" 
                      ? "border-green-200" 
                      : isPastDeadline 
                        ? "border-red-200" 
                        : "border-blue-200"
                  } p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-0 right-0 w-24 h-24 overflow-hidden ${
                    task.status === "completed" 
                      ? "bg-green-500" 
                      : isPastDeadline 
                        ? "bg-red-500" 
                        : "bg-blue-500"
                  }`} style={{ transform: "rotate(45deg) translate(50%, -50%)" }}>
                  </div>
                  <div className={`absolute top-4 right-4 text-xs font-medium text-white px-2 py-1 rounded-lg ${
                    task.status === "completed" 
                      ? "bg-green-600" 
                      : isPastDeadline 
                        ? "bg-red-600" 
                        : "bg-blue-600"
                  }`}>
                    {task.status === "completed" ? "Done" : isPastDeadline ? "Overdue" : "Active"}
                  </div>
                  
                  {/* Title with decorative element */}
                  <div className="flex items-center mb-3">
                    <div className={`w-2 h-12 rounded-full mr-3 ${
                      task.status === "completed" 
                        ? "bg-green-400" 
                        : isPastDeadline 
                          ? "bg-red-400" 
                          : "bg-blue-400"
                    }`}></div>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                      {task.title}
                    </h3>
                  </div>

                  {/* Task details with improved styling */}
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <Briefcase size={16} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate">
                        <span className="font-medium">Meeting:</span>{" "}
                        {task.meetingId?.title || "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <Calendar size={16} className="text-green-500 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span>
                          <span className="font-medium">Deadline:</span>{" "}
                          <span className={isPastDeadline ? "text-red-600 font-medium" : "text-gray-900"}>
                            {formatDate(task.deadline)}
                          </span>
                        </span>
                        {timeRemaining && (
                          <span className={`text-xs mt-1 ${
                            isPastDeadline ? "text-red-500" : "text-blue-500"
                          } font-medium`}>
                            {timeRemaining}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <ClipboardCheck
                        size={16}
                        className={
                          task.status === "completed"
                            ? "text-green-600 flex-shrink-0"
                            : "text-orange-500 flex-shrink-0"
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

                  {/* Progress indicator for incomplete tasks */}
                  {task.status !== "completed" && (
                    <div className="mt-4 mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${isPastDeadline ? "bg-red-500" : "bg-blue-500"}`} 
                             style={{ width: isPastDeadline ? "100%" : "50%" }}></div>
                      </div>
                    </div>
                  )}

                  {/* Complete button with improved styling */}
                  {task.status !== "completed" && (
                    <button
                      className={`mt-4 w-full flex items-center justify-center gap-2 ${
                        isPastDeadline 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      } text-white px-4 py-3 rounded-xl shadow-md transition-all duration-300 text-sm font-medium`}
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
                      <ClipboardCheck size={18} />
                      {isPastDeadline ? "Complete Overdue Task" : "Mark as Completed"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination with improved styling */}
          <div className="flex justify-center mt-10">
            <ReactPaginate
              previousLabel={<span className="flex items-center">←</span>}
              nextLabel={<span className="flex items-center">→</span>}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex gap-2 text-sm"}
              pageClassName={
                "w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition"
              }
              activeClassName={"bg-teal-600 text-white border-transparent"}
              previousClassName={
                "w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50"
              }
              nextClassName={"w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
              breakClassName={"w-8 h-8 flex items-center justify-center text-gray-400"}
            />
          </div>
        </>
      )}
    </div>
  );
}
