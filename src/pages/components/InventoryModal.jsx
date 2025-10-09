import React from "react";
import { useState } from "react";
import { inventoryAPI } from "../../utils/api";

export default function InventoryModal({
  isOpen,
  onClose,
  editingItem,
  onSuccess,
}) {
  const [inventoryFormData, setInventoryFormData] = useState({
    barcode: editingItem?.barcode || "",
    tipe_nama_barang: editingItem?.tipe_nama_barang || "",
    brand: editingItem?.brand || "",
    model: editingItem?.model || "",
    serial_number: editingItem?.serial_number || "",
    deskripsi: editingItem?.deskripsi || "",
    tanggal_pembelian: editingItem?.tanggal_pembelian || "",
    letak_barang: editingItem?.letak_barang || "",
  });

  const handleInventoryInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetInventoryForm = () => {
    setInventoryFormData({
      barcode: "",
      tipe_nama_barang: "",
      brand: "",
      model: "",
      serial_number: "",
      deskripsi: "",
      tanggal_pembelian: "",
      letak_barang: "",
    });
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem.id_barang, inventoryFormData);
      } else {
        await inventoryAPI.create(inventoryFormData);
      }
      onClose();
      resetInventoryForm();
      onSuccess();
    } catch (error) {
      console.error("Error saving item: ", error);
      alert("Failed to save item: " + error.message);
    }
  };

  const handleClose = () => {
    onClose();
    resetInventoryForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingItem ? "Edit inventory item" : "Add new inventory item"}
            </h2>
            <button
              onClick={handleClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400"
            >
              x
            </button>
          </div>
          <form onSubmit={handleInventorySubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Barcode
              </label>
              <input
                type="text"
                name="barcode"
                value={inventoryFormData.barcode}
                onChange={handleInventoryInputChange}
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
                value={inventoryFormData.tipe_nama_barang}
                onChange={handleInventoryInputChange}
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
                  value={inventoryFormData.brand}
                  onChange={handleInventoryInputChange}
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
                  value={inventoryFormData.model}
                  onChange={handleInventoryInputChange}
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
                value={inventoryFormData.serial_number}
                onChange={handleInventoryInputChange}
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
                value={inventoryFormData.location}
                onChange={handleInventoryInputChange}
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
                value={inventoryFormData.status}
                onChange={handleInventoryInputChange}
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
                value={inventoryFormData.tanggal_pembelian}
                onChange={handleInventoryInputChange}
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
                value={inventoryFormData.deskripsi}
                onChange={handleInventoryInputChange}
                placeholder="Additional description"
                rows="3"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex flex-col space-y-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
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
  );
}
