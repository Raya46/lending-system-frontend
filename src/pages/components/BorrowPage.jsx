import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { borrowAPI } from "../../utils/api.js";
import { useSocket } from "../../utils/socket.jsx";
import StudentLendModal from "./StudentLendModal.jsx";
import LecturerLendModal from "./LecturerLendModal.jsx";

const BorrowPage = () => {
  const navigate = useNavigate();
  const { socket, joinStudentRoom } = useSocket();
  const [lendModalOpen, setLendModalOpen] = useState(true);
  const [modalType, setModalType] = useState("student");
  const [borrowerData, setBorrowerData] = useState(null);
  const [waitingForAcceptance, setWaitingForAcceptance] = useState(false);
  const [waitingForBarcodeScan, setWaitingForBarcodeScan] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [completedTransaction, setCompletedTransaction] = useState(null);

  // Join room based on borrower type
  useEffect(() => {
    if (borrowerData?.nim_mahasiswa) {
      joinStudentRoom(borrowerData.nim_mahasiswa);
    } else if (borrowerData?.nip_dosen) {
      // For lecturers, use NIP directly as room identifier
      joinStudentRoom(borrowerData.nip_dosen);
    }
  }, [borrowerData, joinStudentRoom]);

  // Socket listeners for real-time updates
  useEffect(() => {
    // Listen for borrow request acceptance
    socket?.on("borrow_accepted", (data) => {
      console.log("Borrow request accepted:", data);
      setWaitingForAcceptance(false);
      setWaitingForBarcodeScan(true);
      // Don't navigate yet, wait for barcode scan completion
    });

    // Listen for borrow completion
    socket?.on("borrow_completed", (data) => {
      console.log("Borrow completed:", data);
      setWaitingForBarcodeScan(false);
      setCompletedTransaction(data);
      // Show success message with return date, then navigate after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000); // Show success message for 3 seconds
    });

    // Listen for borrow rejection
    socket?.on("borrow_rejected", (data) => {
      console.log("Borrow rejected:", data);
      alert(`Permintaan peminjaman ditolak: ${data.alasan}`);
      navigate("/");
    });

    // Listen for auto-rejection
    socket?.on("borrow_auto_rejected", (data) => {
      console.log("Borrow auto-rejected:", data);
      alert(`Permintaan peminjaman otomatis ditolak: ${data.reason}`);
      navigate("/");
    });

    // Cleanup listeners
    return () => {
      socket?.off("borrow_accepted");
      socket?.off("borrow_completed");
      socket?.off("borrow_rejected");
      socket?.off("borrow_auto_rejected");
    };
  }, [socket, navigate]);

  const handleBorrowSubmit = async (formData) => {
    try {
      // Submit borrow request with support for both student and lecturer
      const requestData = {
        nama_dosen: formData.nama_dosen,
        kelas: formData.kelas,
        nama_prodi: formData.nama_prodi,
        jadwal_id: formData.jadwal_id,
        waktu_pengembalian_dijanjikan: formData.waktu_pengembalian_dijanjikan,
        id_barang: formData.id_barang,
      };

      // Add student or lecturer specific fields
      if (modalType === "student") {
        requestData.nama_mahasiswa = formData.nama_mahasiswa;
        requestData.nim_mahasiswa = formData.nim_mahasiswa;
      } else if (modalType === "lecturer") {
        requestData.nama_dosen = formData.nama_dosen;
        requestData.nip_dosen = formData.nip_dosen;
      }

      const response = await borrowAPI.submitRequest(requestData);

      // Store borrower data and transaction info based on type
      if (modalType === "student") {
        setBorrowerData({
          nama_mahasiswa: formData.nama_mahasiswa,
          nim_mahasiswa: formData.nim_mahasiswa,
        });
        joinStudentRoom(formData.nim_mahasiswa);
      } else if (modalType === "lecturer") {
        setBorrowerData({
          nama_dosen: formData.nama_dosen,
          nip_dosen: formData.nip_dosen,
        });
        joinStudentRoom(formData.nip_dosen);
      }

      setCurrentTransaction(response.data);

      // Close modal and show waiting state
      setLendModalOpen(false);
      setWaitingForAcceptance(true);

      const borrowerTypeText = modalType === "lecturer" ? "dosen" : "mahasiswa";
      alert(
        `Permintaan peminjaman berhasil diajukan untuk ${borrowerTypeText}! ID Transaksi: ${response.data.transaction_id}`
      );
      // Don't navigate yet, wait for admin response
    } catch (error) {
      console.error("Error submitting borrow request:", error);
      alert("Gagal mengajukan permintaan peminjaman: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render appropriate modal based on modalType */}
      {modalType === "lecturer" ? (
        <LecturerLendModal
          isOpen={lendModalOpen}
          onClose={() => navigate("/")}
          onSubmit={handleBorrowSubmit}
          borrowerData={borrowerData}
          modalType={modalType}
          setModalType={setModalType}
        />
      ) : (
        <StudentLendModal
          isOpen={lendModalOpen}
          onClose={() => navigate("/")}
          onSubmit={handleBorrowSubmit}
          borrowerData={borrowerData}
          modalType={modalType}
          setModalType={setModalType}
        />
      )}

      {/* Waiting for Admin Acceptance */}
      {waitingForAcceptance && currentTransaction && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Menunggu Persetujuan Admin
                </h2>
                <p className="text-gray-600 mb-4">
                  Permintaan peminjaman Anda sedang diproses. Silakan menuju ke
                  meja admin.
                </p>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>ID Transaksi:</strong>{" "}
                    {currentTransaction.transaction_id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Nama:</strong>{" "}
                    {borrowerData?.nama_mahasiswa || borrowerData?.nama_dosen}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>ID:</strong>{" "}
                    {borrowerData?.nim_mahasiswa || borrowerData?.nip_dosen}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Tipe:</strong>{" "}
                    {borrowerData?.nim_mahasiswa ? "Mahasiswa" : "Dosen"}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waiting for Admin to Scan Barcode */}
      {waitingForBarcodeScan && currentTransaction && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Terima Barang dari Admin
                </h2>
                <p className="text-gray-600 mb-4">
                  Admin sedang memproses peminjaman. Tunggu sebentar...
                </p>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>ID Transaksi:</strong>{" "}
                    {currentTransaction.transaction_id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Nama:</strong>{" "}
                    {borrowerData?.nama_mahasiswa || borrowerData?.nama_dosen}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>ID:</strong>{" "}
                    {borrowerData?.nim_mahasiswa || borrowerData?.nip_dosen}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Tipe:</strong>{" "}
                    {borrowerData?.nim_mahasiswa ? "Mahasiswa" : "Dosen"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Completed Successfully */}
      {completedTransaction && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Barang Berhasil Dipinjam!
                </h2>
                <p className="text-gray-600 mb-4">
                  Jangan lupa kembalikan barang pada tanggal{" "}
                  <strong>
                    {new Date(
                      completedTransaction.transaction?.waktu_pengembalian_dijanjikan
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </strong>
                </p>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Barang:</strong>{" "}
                    {completedTransaction.transaction?.tipe_nama_barang}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Barcode:</strong>{" "}
                    {completedTransaction.transaction?.barcode}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Brand:</strong>{" "}
                    {completedTransaction.transaction?.brand}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Model:</strong>{" "}
                    {completedTransaction.transaction?.model}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Modal akan tertutup otomatis...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowPage;
