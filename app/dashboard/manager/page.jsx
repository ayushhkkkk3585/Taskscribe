"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Tag, User, ClipboardList, Menu, X } from "lucide-react";
import ReactPaginate from "react-paginate";

// Add CSS for custom scrollbar
const scrollbarStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
`;

export default function ManagerDashboard() {
  const router = useRouter();
  const [root, setRoot] = useState("");
  const [user, setUser] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const cardsPerPage = 6;
  const offset = currentPage * cardsPerPage;
  const currentCards = meetings.slice(offset, offset + cardsPerPage);
  const pageCount = Math.ceil(meetings.length / cardsPerPage);

  const pastelColors = [
    "bg-pink-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-purple-50",
    "bg-yellow-50",
    "bg-teal-50",
  ];

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return router.push("/login");

    const decoded = parseJwt(token);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setRoot(storedUser);
    }
    if (!decoded || decoded.role !== "manager")
      return router.push("/dashboard/employee");

    // Set the user information from the decoded token
    setUser(decoded);

    fetch("/api/meetings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setMeetings(data.meetings || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error);
        setMeetings([]);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Calculate metrics for dashboard
  const completedMeetings = meetings.filter(m => m.status === "completed").length;
  const pendingMeetings = meetings.filter(m => m.status === "pending").length;
  const upcomingMeetings = meetings.filter(m => new Date(m.date) > new Date()).length;
  const totalTasks = meetings.reduce((acc, meeting) => acc + (meeting.summary?.length || 0), 0);

  if (loading) return (
    <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-gray-200 h-48"></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6 ">
      {/* Add scrollbar styles */}
      <style jsx global>{scrollbarStyles}</style>
      
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold bg-teal-600 bg-clip-text text-transparent">
          Manager Dashboard
        </h1>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => router.push("/dashboard/manager/create-meeting")}
            className="bg-teal-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition"
          >
            + Create New Meeting
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2.5 rounded-xl shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg border"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mb-6 bg-gray-100 p-4 rounded-xl shadow">
          <button
            onClick={() => {
              router.push("/dashboard/manager/create-meeting");
              setMenuOpen(false);
            }}
            className="bg-teal-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition"
          >
            + Create New Meeting
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2.5 rounded-xl shadow-md"
          >
            Logout
          </button>
        </div>
      )}

      {/* Welcome */}
      <h2 className="text-xl mb-4 text-gray-700">
        👋 Welcome, <span className="font-semibold capitalize">{root?.name}</span>
      </h2>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Total Meetings</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-teal-700">{meetings.length}</span>
            <Calendar className="ml-auto text-teal-500" size={24} />
          </div>
        </div>
        
        {/* <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Completed</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-green-600">{completedMeetings}</span>
            <div className="ml-auto w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <ClipboardList className="text-green-500" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Pending</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-orange-600">{pendingMeetings}</span>
            <div className="ml-auto w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <ClipboardList className="text-orange-500" size={20} />
            </div>
          </div>
        </div> */}
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm text-gray-500">Total Tasks</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-blue-600">{totalTasks}</span>
            <div className="ml-auto w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ClipboardList className="text-blue-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Meetings */}
      {!meetings || meetings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-lg italic">No meetings found 🚀</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentCards.map((meeting, index) => {
              // Calculate meeting metrics
              const taskCount = meeting.summary?.length || 0;
              const completedTasksCount = meeting.summary?.filter(task => task.status === "completed").length || 0;
              const taskCompletionRate = taskCount > 0 ? Math.round((completedTasksCount / taskCount) * 100) : 0;
              const isUpcoming = new Date(meeting.date) > new Date();
              
              return (
                <div
                  key={meeting._id}
                  className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6"
                >
                  {/* Status indicator */}
                  <div className={`absolute top-0 right-0 w-24 h-24 overflow-hidden ${
                    meeting.status === "completed" 
                      ? "bg-green-500" 
                      : meeting.status === "pending" 
                        ? "bg-yellow-500" 
                        : "bg-blue-500"
                  }`} style={{ transform: "rotate(45deg) translate(50%, -50%)" }}>
                  </div>
                  
                  {/* Date with calendar icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                      <Calendar size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(meeting.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    {/* <span
                      className={`ml-auto inline-block text-xs px-3 py-1 rounded-full font-medium ${
                        meeting.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : meeting.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {meeting.status}
                    </span> */}
                  </div>

                  {/* Title with decorative element */}
                  <div className="flex items-center mb-3">
                    <div className={`w-2 h-12 rounded-full mr-3 ${
                      meeting.status === "completed" 
                        ? "bg-green-400" 
                        : meeting.status === "pending" 
                          ? "bg-yellow-400" 
                          : "bg-blue-400"
                    }`}></div>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                      {meeting.title}
                    </h3>
                  </div>

                  {/* Tags with better styling */}
                  {meeting.tags && meeting.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {meeting.tags.map((tag, tagIdx) => (
                        <span 
                          key={tagIdx} 
                          className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Task metrics */}
                  {/* {taskCount > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Task Completion</span>
                        <span className="text-sm font-bold text-teal-600">{taskCompletionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-teal-500" 
                          style={{ width: `${taskCompletionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )} */}

                  {/* Tasks */}
                  {meeting.summary && meeting.summary.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <ClipboardList size={16} className="text-indigo-500" />{" "}
                        Tasks ({meeting.summary.length})
                      </h4>
                      <ul className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {meeting.summary.map((task, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border-l-4 border-indigo-300"
                          >
                            <span className="truncate pr-2">{task.description}</span>
                            <span className="flex items-center gap-1 text-blue-600 font-medium text-xs whitespace-nowrap">
                              <User size={14} />{" "}
                              {task.assignedTo?.name || "Unassigned"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
              activeClassName={"bg-teal-600  text-white border-transparent"}
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
