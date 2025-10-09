import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI, dropdownAPI } from "../utils/api.js";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";

const AdminClassLog = () => {
  const navigate = useNavigate();

  // class data state
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [programStudies, setProgramStudies] = useState([]);
  const itemsPerPage = 10;

  // statistic state
  const [statistic, setStatistic] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalActiveLoans: 0,
    activeClasses: 0,
  });

  const fetchClassData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dashboardAPI.getClassesTable(
        currentPage,
        itemsPerPage
      );

      if (data.success) {
        setClassData(data.data || []);
        setTotalPages(data.pagination.total_pages || 1);
      } else {
        throw new Error(data.message || "Failed to load class data");
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      setError(error.message || "Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await dashboardAPI.getClassesOverview();
      if (data.success) {
        setStatistic({
          totalClasses: data.data.total_classes || 0,
          totalStudents: data.data.total_students || 0,
          totalActiveLoans: data.data.active_loans || 0,
          activeClasses: data.data.active_classes || 0,
        });
      } else {
        console.error("Failed to load statistics");
      }
    } catch (error) {
      console.error("Error fetching statistics: ", error);
    }
  };

  // fetch class data
  useEffect(() => {
    fetchClassData();
  }, [currentPage]);

  useEffect(() => {
    fetchStatistics();
    console.log(programStudies);
  }, []);

  // fetch program studies
  useEffect(() => {
    const fetchProgramStudies = async () => {
      try {
        const response = await dropdownAPI.getProgramStudies();
        setProgramStudies(response.data);
      } catch (error) {
        console.error("Error fetching program studies: ", error);
      }
    };

    fetchProgramStudies();
  }, []);

  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600" : "text-gray-500";
  };

  const handleClassClick = (className) => {
    navigate(`/class-log/${className}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p>loading</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <p>Error: {error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Class List View Component
  const ClassLogContent = () => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Class Log</h1>
          <div className="flex items-center space-x-3">
            <button
              className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#048494" }}
            >
              Import Mahasiswa by Excel
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Download all
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-6 0H3m2-2h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Classes
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistic.totalClasses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Students
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistic.totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Loans
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistic.totalActiveLoans}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-teal-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Classes
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistic.activeClasses}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Loans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classData.length > 0 ? (
                  classData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleClassClick(item.class_name)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {item.class_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.total_students_per_kelas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.active_loans_per_kelas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No class data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`hover:text-gray-700 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`hover:text-gray-700 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchPlaceholder="Search class..." />
        <div className="flex-1 overflow-y-auto">
          <ClassLogContent />
        </div>
      </div>
    </div>
  );
};

export default AdminClassLog;
