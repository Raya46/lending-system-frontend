import { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { useDashboardSocket } from "../hooks/useDashboardSocket.js";
import { borrowAPI } from "../utils/api.js";
import BarcodeScannerModal from "./components/BarcodeScannerModal.jsx";
import Header from "./components/Header";
import InventoryModal from "./components/InventoryModal.jsx";
import InventorySummary from "./components/InventorySummary.jsx";
import InventoryTable from "./components/InventoryTable.jsx";
import LectureLendModal from "./components/LecturerLendModal.jsx";
import LowStockItems from "./components/LowStockItems.jsx";
import PendingRequests from "./components/PendingRequests.jsx";
import Sidebar from "./components/Sidebar";
import StudentLendModal from "./components/StudentLendModal.jsx";
import TopLendingItems from "./components/TopLendingItems.jsx";

const AdminDashboard = () => {
  const [lendModalOpen, setLendModalOpen] = useState(false);
  const [modalType, setModalType] = useState("student"); // 'student' or 'lecturer'
  const [borrowerData, setBorrowerData] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  const { dashboardData, setDashboardData, refreshPendingRequests } =
    useDashboardData();

  // Function to determine modal type based on name input
  const handleLendClick = () => {
    setLendModalOpen(true);
    setModalType("student"); // Default to student
    setBorrowerData(null);
  };

  const handleAddProductClick = () => {
    setEditingItem(null);
    setShowInventoryModal(true);
  };

  // socket setup for realtime updates
  useDashboardSocket(setDashboardData, refreshPendingRequests);

  // extract data for rendering
  const {
    topLendingItems,
    lowStockItems,
    inventoryData,
    inventorySummary,
    pendingRequests,
    loading,
    error,
  } = dashboardData;

  const handleAcceptRequest = async (transactionId) => {
    try {
      await borrowAPI.acceptRequest(transactionId);
      // refresh pending request
      const pendingResponse = await borrowAPI.getPendingRequests();
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests: pendingResponse.data || [],
      }));
    } catch (error) {
      console.error("Error accepting request: ", error);
      alert("Failed to accept request: " + error.message);
    }
  };

  const handleBarcodeScanSuccess = () => {
    window.location.reload();
  };

  const handleRejectRequest = async (transactionId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await borrowAPI.rejectRequest(transactionId, reason);
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting request: ", error);
      alert("Failed to reject request: " + error.message);
    }
  };

  const handleDirectLending = async (formData) => {
    try {
      await borrowAPI.directLending(formData);
      alert("Peminjaman langsung dari admin berhasil!");
      setLendModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error direct lending: ", error);
      alert("Gagal melakukan peminjaman langsung dari admin: " + error.message);
    }
  };

  const LendingDashboard = () => {
    if (loading) {
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboar data</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="mt-4 text-gray-600">Failed to load dashboard</p>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="p-6 space-y-6">
        {/* Top section with two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Lending Items */}
          <TopLendingItems topLendingItems={topLendingItems} />

          {/* Low Quantity Stock */}
          <LowStockItems lowStockItems={lowStockItems} />
        </div>

        {/* Inventory section */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddProductClick}
              className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#048494" }}
            >
              Add Product
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Filters
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Download all
            </button>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              See All
            </button>
          </div>
        </div>

        {/* inventory table */}
        <InventoryTable inventoryData={inventoryData} />

        {/* inventory summary */}
        <InventorySummary
          inventorySummary={inventorySummary}
          onLendClick={handleLendClick}
        />

        {/* pending request */}
        <PendingRequests
          pendingRequests={pendingRequests}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onBarcodeScan={(transactionId) => {
            setSelectedTransactionId(transactionId);
            setShowBarcodeScanner(true);
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchPlaceholder="Search product..." />
        <div className="flex-1 overflow-y-auto">
          <LendingDashboard />
        </div>
      </div>
      {lendModalOpen &&
        (modalType === "student" ? (
          <StudentLendModal
            isOpen={lendModalOpen}
            onClose={() => setLendModalOpen(false)}
            onSubmit={handleDirectLending}
            modalType={modalType}
            setModalType={setModalType}
            borrowerData={borrowerData}
          />
        ) : (
          <LectureLendModal
            isOpen={lendModalOpen}
            onClose={() => setLendModalOpen(false)}
            onSubmit={handleDirectLending}
            modalType={modalType}
            setModalType={setModalType}
            borrowerData={borrowerData}
          />
        ))}
      {/* inventory modal for adding/editing inventory item */}
      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => {
          setShowInventoryModal(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSuccess={() => {
          window.location.reload();
        }}
      />

      {/* barcode scanner modal */}
      {showBarcodeScanner && (
        <BarcodeScannerModal
          isOpen={showBarcodeScanner}
          onClose={() => {
            setShowBarcodeScanner(false);
            setSelectedTransactionId(null);
          }}
          transactionId={selectedTransactionId}
          onSuccess={handleBarcodeScanSuccess}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
