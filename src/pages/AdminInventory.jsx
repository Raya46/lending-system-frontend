import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { inventoryAPI } from "../utils/api";

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    barcode: "",
    tipe_nama_barang: "",
    brand: "",
    model: "",
    serial_number: "",
    deskripsi: "",
    status: "tersedia",
    tanggal_pembelian: "",
    letak_barang: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      barcode: "",
      tipe_nama_barang: "",
      brand: "",
      model: "",
      serial_number: "",
      deskripsi: "",
      status: "tersedia",
      tanggal_pembelian: "",
      letak_barang: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem.id_barang, formData);
      } else {
        await inventoryAPI.create(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchInventoryData();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item: " + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      barcode: item.barcode || "",
      tipe_nama_barang: item.tipe_nama_barang || "",
      brand: item.brand || "",
      model: item.model || "",
      serial_number: item.serial_number || "",
      deskripsi: item.deskripsi || "",
      status: item.status || "",
      tanggal_pembelian: item.tanggal_pembelian || "",
      letak_barang: item.letak_barang || "",
    });
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auo"></div>
                <p className="mt-4 text-gray-600"></p>
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
              resetForm();
              setShowModal(true);
            }}
          >
            Add Product
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
      {/* Modal for adding/editing inventory item */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingItem
                    ? "Edit inventory item"
                    : "Add new inventory item"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="w-6 h-6 flex items-center justify-center text-gray-400"
                >
                  x
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    placeholder="Enter barcode"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Item type/name
                  </label>
                  <input
                    type="text"
                    name="tipe_nama_barang"
                    value={formData.tipe_nama_barang}
                    onChange={handleInputChange}
                    placeholder="e.g., Laptop, Projector"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g., ASUS"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Vivobook x441"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    placeholder="Enter serial number"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Lab komputer 1"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                  >
                    <option value="tersedia">Available</option>
                    <option value="dipinjam">Borrowed</option>
                    <option value="diperbaiki">Under Repair</option>
                    <option value="rusak">Damaged</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="tanggal_pembelian"
                    value={formData.tanggal_pembelian}
                    onChange={handleInputChange}
                    placeholder="Enter serial number"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Additional description"
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="w-full py-2.5 px-4 bg-white text-gray-700 border border-gray-300 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-white text-gray-700 border border-gray-300 rounded-md font-medium"
                    style={{ backgroundColor: "#048494" }}
                  >
                    {editingItem ? "Update item " : "Create item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
