"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("../../../components/Loader.jsx"), {
  ssr: false,
});

export default function CreateMeetingPage() {
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [managerId, setManagerId] = useState("");
  const router = useRouter();
  const [loadingSummary, setLoadingSummary] = useState(false);

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

    setManagerId(decoded.id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSummary(true);

    const res = await fetch("/api/meetings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        managerId,
        title,
        transcript,
        date,
        tags: tags.split(",").map((t) => t.trim()),
      }),
    });

    const data = await res.json();
    setLoadingSummary(false);
    if (res.ok) {
      alert("✅ Meeting created successfully!");
      router.push("/dashboard/manager");
    } else {
      alert("❌ Error: " + data.error);
    }
  };
  if (loadingSummary) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader />
        <div className="mt-6 text-teal-700 text-lg font-semibold text-center">
          Generating meeting summary and tasks using AI...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-5 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create New Meeting
        </h1>

        {!loadingSummary && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                placeholder="Enter meeting title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Transcript */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Transcript
              </label>
              <textarea
                placeholder="Eg) In the meeting, it was discussed that Vikas (vikas@gmail.com) is spearheading the ML model development and will complete it by September 20, 2025."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tags
              </label>
              <input
                type="text"
                placeholder="e.g. finance, planning, review"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
            >
              Create Meeting
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
