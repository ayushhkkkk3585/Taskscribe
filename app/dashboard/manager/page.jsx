"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Tag, User, ClipboardList, Menu, X } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function ManagerDashboard() {
  const router = useRouter();
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
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
      <h2 className="text-xl mb-6 text-gray-700">
        👋 Welcome back,{" "}
        <span className="font-semibold capitalize">
          {user?.name }
        </span>
      </h2>

      {/* Meetings */}
      {!meetings || meetings.length === 0 ? (
        <p className="text-gray-500 italic">No meetings found 🚀</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentCards.map((meeting, index) => (
              <div
                key={meeting._id}
                className={`${pastelColors[index % pastelColors.length]} relative rounded-2xl shadow-md hover:shadow-lg transition p-6`}
              >
                {/* Date */}
                <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  {new Date(meeting.date).toLocaleDateString()}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {meeting.title}
                </h3>

                {/* Status */}
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-3 ${
                    meeting.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : meeting.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {meeting.status}
                </span>

                {/* Tags */}
                <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Tag size={16} className="text-teal-500" />
                  {meeting.tags?.length > 0
                    ? meeting.tags.join(", ")
                    : "No tags"}
                </p>

                {/* Tasks */}
                {meeting.summary && meeting.summary.length > 0 && (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <ClipboardList size={16} className="text-indigo-500" />{" "}
                      Tasks
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {meeting.summary.map((task, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                        >
                          <span>{task.description}</span>
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <User size={14} />{" "}
                            {task.assignedTo?.name || "Unassigned"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
