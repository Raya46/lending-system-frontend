import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useSocket } from "../utils/socket.jsx";
import { dashboardAPI } from "../utils/api";

const AdminHistoryLog = () => {
  const { socket, joinAdminRoom } = useSocket();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // function to fetch history log data
  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getHistoryLog(currentPage, itemsPerPage);
      if (data.success) {
        setHistoryData(data.data);
        setTotalPages(data.pagination?.total_pages);
      } else {
        throw new Error(data.message || "Failed to load history data");
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
      setError(error.message || "Failed to load history data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // fetch history log data on mount and when page changes
  useEffect(() => {
    fetchHistoryData();
  }, [currentPage]);

  // socket io setup for realtime updates
  useEffect(() => {
    // join admin room for realtime notif
    joinAdminRoom();

    // listen for new borrow requests
    socket?.on("new_borrow_request", () => {
      console.log("new borrow request received");
      fetchHistoryData();
    });

    // listen for request processing updates
    socket?.on("request_processed", () => {
      console.log("request processed");

      fetchHistoryData();
    });

    // listen for auto-rejected requests
    socket?.on("borrow_auto_rejected", () => {
      console.log("request auto-rejected");

      fetchHistoryData();
    });

    // listen for direct lending completion
    socket?.on("direct_lending_completed", () => {
      console.log("direct lending completed");

      fetchHistoryData();
    });
    // listen for overdue items updates (automatic status changes)
    socket?.on("items_overdue", () => {
      console.log("items became overdue");

      fetchHistoryData();
    });
    // listen for item returns
    socket?.on("item_returned", () => {
      console.log("item returned");

      fetchHistoryData();
    });

    // cleanup listeners on unmount
    return () => {
      socket?.off("new_borrow_request");
      socket?.off("request_processed");
      socket?.off("borrow_auto_rejected");
      socket?.off("direct_lending_completed");
      socket?.off("items_overdue");
      socket?.off("item_returned");
    };
  }, [socket, joinAdminRoom, fetchHistoryData]);

  const getStatusColor = (status) => {
    return status === "dipinjam"
      ? "text-blue-600"
      : status === "dikembalikan"
      ? "text-green-600"
      : status === "pending"
      ? "text-yellow-600"
      : "text-red-600";
  };

  const HistoryLogContent = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">History Log</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <tr
                    key={item.peminjaman_id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nama_peminjam}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tipe_nama_barang || "Barang tidak dipilih"}
                      {item.notes_checkout &&
                        (() => {
                          try {
                            const notes = JSON.parse(item.notes_checkout);
                            return (
                              notes.direct_admin_lending && (
                                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  Direct Admin
                                </span>
                              )
                            );
                          } catch {
                            return null;
                          }
                        })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(() => {
                        try {
                          const notes = JSON.parse(item.notes_checkout || "{}");
                          return notes.class_name || "N/A";
                        } catch {
                          return "N/A";
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.waktu_pengembalian_dijanjikan
                        ? new Date(
                            item.waktu_pengembalian_dijanjikan
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${getStatusColor(
                          item.status_peminjaman
                        )}`}
                      >
                        {item.status_peminjaman === "dipinjam"
                          ? "Borrowed"
                          : item.status_peminjaman === "dikembalikan"
                          ? "Returned"
                          : item.status_peminjaman === "pending"
                          ? "Pending"
                          : item.status_peminjaman}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No borrow requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading history log</p>
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
                <p>Failed to load history log</p>
                <p>{error}</p>
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
        <Header searchPlaceholder="Search history..." />
        <div className="flex-1 overflow-y-auto">
          <HistoryLogContent />
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryLog;
