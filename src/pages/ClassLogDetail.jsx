import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classAPI } from "../utils/api";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const ClassLogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // state for class data and borrowers
  const [classData, setClassData] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [_editForm, setEditForm] = useState({
    lecturer: "",
    room: "",
  });
  // const [updating, setUpdating] = useState(false);

  // state for dropdown data
  // const [lecturers, setLecturers] = useState([]);
  // const [rooms, setRooms] = useState([]);

  const handleEditClass = () => {
    setEditForm({
      lecturer: classData.lecturer,
      room: classData.room,
    });
    setShowEditModal(true);
  };

  // const handleUpdateClass = async (e) => {
  //   e.preventDefault();
  //   setUpdating(true);
  //   try {
  //     const data = await classAPI.updateClass(id, editForm);
  //     if (data.success) {
  //       const classResponse = await classAPI.getClassDetails(id);
  //       const newData = classResponse.data;
  //       const stats = newData.statistics || {};
  //       setClassData({
  //         id: id,
  //         name:
  //           newData.class_info.kepanjangan_prodi ||
  //           newData.class_info.nama_prodi,
  //         lecturer: newData.class_info.lecturers,
  //         room: newData.class_info.rooms,
  //         totalBorrowers: stats.total_borrowers,
  //         activeBorrowers: stats.active_borrowers,
  //         completedBorrowers: stats.completed_borrowers,
  //       });
  //       setShowEditModal(false);
  //       alert("Class information updated");
  //     } else {
  //       alert("failed to update class information" + data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating class:", error);
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  // fetch class details

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await classAPI.getClassDetails(id);
        const data = response.data;

        // set class data from class_info
        const classInfo = data.class_info;
        const stats = data.statistics;

        setClassData({
          id: id,
          name: classInfo.kepanjangan_prodi || classInfo.nama_prodi,
          lecturer: classInfo.lecturers,
          room: classInfo.rooms,
          schedule: classInfo.schedules,
          totalBorrowers: stats.total_borrowers,
          activeBorrowers: stats.active_borrowers,
          completedBorrowers: stats.completed_borrowers,
        });

        setBorrowers(data.borrowers);
      } catch (error) {
        console.error("Error fetching class details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "text-green-600 bg-green-100";
  //     case "completed":
  //       return "text-blue-600 bg-blue-100";
  //     case "overdue":
  //       return "text-red-600 bg-red-100";

  //     default:
  //       return "text-gray-600 bg-gray-100";
  //   }
  // };
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header searchPlaceholder="search borrowers..." />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading class details...</p>
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
          <Header searchPlaceholder="search borrowers..." />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <p className="mt-4 text-gray-600">
                  Failed to load class details
                </p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header searchPlaceholder="search borrowers..." />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <p className="mt-4 text-gray-600">No class data available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchPlaceholder="search borrowers..." />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* class info header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {classData.name}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleEditClass}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md "
                >
                  Edit class
                </button>
                <button
                  onClick={() => navigate("/class-log")}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md "
                >
                  Back to class log
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Lecturer</div>
                <div className="font-medium text-gray-900">
                  {classData.lecturer}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Room</div>
                <div className="font-medium text-gray-900">
                  {classData.room}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Schedule</div>
                <div className="font-medium text-gray-900">
                  {classData.schedule}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Borrower</div>
                <div className="font-medium text-gray-900">
                  {classData.totalBorrowers}
                </div>
              </div>
            </div>
          </div>

          {/* statistics card */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg"></div>
                <div className="ml-4">
                  <div className="text-sm text-gray-500">Active Borrowers</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {classData.activeBorrowers}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg"></div>
                <div className="ml-4">
                  <div className="text-sm text-gray-500">Completed</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {classData.completedBorrowers}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg"></div>
                <div className="ml-4">
                  <div className="text-sm text-gray-500">Total items</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {classData.totalBorrowers}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* borrowers table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2>Borrowers</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>NIM</th>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Last Borrow Time</th>
                    <th>Borrow Count</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowers.length > 0 ? (
                    borrowers.map((borrower, index) => (
                      <tr key={borrower.nim || index}>
                        <td>{borrower.student_name}</td>
                        <td>{borrower.nim}</td>
                        <td>
                          {borrower.unreturned_items ||
                            borrower.returned_items ||
                            "No Items"}
                        </td>
                        <td>
                          {borrower.borrower_type === "active_borrower"
                            ? "active"
                            : "inactive"}
                        </td>
                        <td>
                          {borrower.last_borrow_time
                            ? new Date(
                                borrower.last_borrow_time
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>{borrower.number_of_times_borrowing || 0} times</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No borrowers found for this class</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div>
          <p>edit</p>
        </div>
      )}
    </div>
  );
};
export default ClassLogDetail;
