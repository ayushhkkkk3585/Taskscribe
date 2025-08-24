"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className=" bg-gradient-to-br">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
                  ✨ AI-Powered Meeting Management
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r bg-teal-700 bg-clip-text text-transparent">
                    {" "}
                    Meetings
                  </span>
                  <br />
                  Into Action
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Automatically convert meeting transcripts into organized
                  tasks, assign them to team members, and track progress—all
                  powered by AI.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:text-teal-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Login
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:border-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  SignUp
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div> */}
            </div>

            {/* Right Content - Image/Demo */}
            <div className="relative lg:-mt-8">
              <div className="relative rounded-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/cll.gif"
                  alt="Taskcribe Dashboard"
                  width={500}
                  height={400}
                  className="rounded-lg w-full h-auto"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-16 lg:py-24 "
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Taskcribe Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your meeting chaos into organized
              productivity
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100">
              <div className="absolute -top-4 left-8 bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                1
              </div>
              <div className="pt-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Transcript
                </h3>
                <p className="text-gray-600">
                  Simply paste your meeting transcript and let the magic happen.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100">
              <div className="absolute -top-4 left-8 bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                2
              </div>
              <div className="pt-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Analysis
                </h3>
                <p className="text-gray-600">
                  Our AI identifies action items, deadlines, and assigns tasks
                  instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100">
              <div className="absolute -top-4 left-8 bg-teal-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                3
              </div>
              <div className="pt-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Auto-Display Tasks
                </h3>
                <p className="text-gray-600">
                  Tasks are automatically displayed to team members with
                  deadlines and context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-16 lg:py-24">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your Meetings?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of teams already saving 5+ hours per week with
                Taskcribe
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
                >
                  Start Free Trial - No Credit Card Required
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-teal-600 transition-all duration-200"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/log.png"
                alt="Taskcribe Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">Taskcribe</span>
            </div>
            <div className="flex space-x-6 text-gray-600">
              Made with ❤️ by Ayush K
            </div>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              © 2025 Taskcribe. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
