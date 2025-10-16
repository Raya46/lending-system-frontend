import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { inventoryAPI } from "../utils/api";
import InventoryModal from "./components/InventoryModal";

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await inventoryAPI.getAll(currentPage, itemsPerPage);
      if (data.success) {
        setInventoryData(data.data || []);
        setTotalPages(data.pagination.total_pages || 1);
      } else {
        throw new Error(data.message || "Failed to load inventory data");
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setError(error.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleModalSuccess = () => {
    fetchInventoryData();
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure want to delete this item?")) {
      try {
        await inventoryAPI.delete(id);
        fetchInventoryData();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item: " + error.message);
      }
    }
  };

  // fetch inventory data
  useEffect(() => {
    fetchInventoryData();
  }, [currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "tersedia":
        return "text-green-600";
      case "dipinjam":
        return "text-orange-600";
      case "diperbaikik":
        return "text-yellow-600";
      case "rusak":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "tersedia":
        return "Available";
      case "dipinjam":
        return "Borrowed";
      case "diperbaiki":
        return "Under Repair";
      case "rusak":
        return "Damaged";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header searchPlaceholder="Search Inventory..." />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading inventory data...</p>
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
          <Header searchPlaceholder="Search Inventory..." />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-900 font-medium">
                  Failed to load inventory
                </p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const InventoryContent = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory Management
        </h1>
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
            style={{ backgroundColor: "#048494" }}
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand & Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial NUmber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.length > 0 ? (
                inventoryData.map((item, index) => (
                  <tr
                    key={item.id_barang || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.tipe_nama_barang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.barcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.brand && item.model
                        ? `${item.brand} ${item.model}`
                        : item.brand || item.model || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.serial_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.letak_barang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${getStatusColor(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_barang)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  ></td>
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
            } `}
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
            } `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <InventoryContent />
        </div>
      </div>
      <InventoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminInventory;
