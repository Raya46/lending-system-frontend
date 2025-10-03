import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function LoginPage() {
  const PNJLogo = () => (
    <>
      <img
        src="./src/assets/PEENJE.png"
        className="w-1000 h-1000 md:w-100 md:h-100 items-center justify-center"
      />
    </>
  );

  const InventoryIcon = () => (
    <>
      <img
        src="./src/assets/PEENJE.png"
        className="w-10 h-10 md:w-18 md:h-18 object-contain mx-auto"
      />
    </>
  );

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("admin", JSON.stringify(data.data.admin));
        localStorage.setItem("isLoggedIn", "true");

        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16 lg:space-x-24 max-w-4xl w-full">
        <div className="flex-shrink-0">
          <PNJLogo />
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm md:max-w-md">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={() => navigate("/")}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-center mb-6">
            <InventoryIcon />
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
              Log in to your account
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : null}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Username
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Password
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">
                Remember for 30 days
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#048494" }}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
