import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email); // Replace with API call
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs w-full max-w-md p-6 sm:p-7">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">Forgot Password</h3>
        </div>

        {/* Form */}
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="grid gap-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="py-2.5 sm:py-3 px-4 block w-full bg-white border border-gray-200 rounded-lg sm:text-sm text-gray-800 placeholder:text-gray-500 focus:border-blue-700 focus:ring-blue-700"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 border border-transparent text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}