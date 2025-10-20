// Landing Page
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const PNJLogo = () => (
    <div className="flex items-center justify-center">
      <img
        src="./src/assets/PEENJE.png"
        className="w-48 h-48 md:w-64 md:h-64 object-contain"
        alt="PEENJE Logo"
      />
    </div>
  );

  const InventoryIcon = () => (
    <div className="flex items-center justify-center mb-4">
      <img
        src="./src/assets/PEENJE.png"
        className="w-12 h-12 md:w-16 md:h-16 object-contain"
        alt="Inventory Icon"
      />
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16 lg:space-x-24 max-w-4xl w-full">
        <div className="flex-shrink-0">
          <PNJLogo />
        </div>

        <div className="text-center w-full md:w-auto">
          <InventoryIcon />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Inventory System
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8">What's your purpose?</p>

          <div className="space-y-3 w-full max-w-xs mx-auto md:w-64">
            <button
              onClick={() => navigate("/borrow")}
              className="w-full py-3 px-6 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#048494" }}
            >
              Borrow
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-6 rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#eae9e5", color: "#212122" }}
            >
              Login Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
