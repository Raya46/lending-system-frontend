// Borrow Modal
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../utils/socket";
import { borrowAPI } from "../../utils/api";
import StudentLendModal from "./StudentLendModal";

export default function BorrowPage() {
  const navigate = useNavigate();
  const { socket, joinStudentRoom } = useSocket();
  const [modalType, setModalType] = useState("student");
  const [borrowerData, setBorrowerData] = useState(null);
  const [waitingForAcceptance, setWaitingForAcceptance] = useState(false);
  const [waitingForBarcodeScan, setWaitingForBarcodeScan] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [lendModal, setLendModal] = useState(true);

  useEffect(() => {
    if (borrowerData?.nim_mahasiswa) {
      joinStudentRoom(borrowerData.nim_mahasiswa);
    }
  }, [borrowerData, joinStudentRoom]);

  useEffect(() => {
    // listener fro borrow request acceptance
    socket?.on("borrow_accepted", (data) => {
      console.log("borrow request accepted: ", data);
      setWaitingForAcceptance(false);
      setWaitingForBarcodeScan(true);
    });
    // listener for borrow completion
    socket?.on("borrow_completed", (data) => {
      console.log("Borrow completed: ", data);
      setWaitingForAcceptance(false);
      setCompletedTransaction(data);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    });
    // listener for borrow rejection
    socket?.on("borrow_rejected", (data) => {
      console.log("borrow rejected", data);
      alert(`Permintaan peminjaman ditolak: ${data.alasan}`);
      navigate("/");
    });
    // listener for auto-rejection
    socket?.on("borrow_auto_rejected", (data) => {
      console.log("borrow auto-rejected: ", data);
      alert(`Permintaan peminjaman otomatis ditolak: ${data.reason}`);
      navigate("/");
    });

    return () => {
      socket?.off("borrow_accepted");
      socket?.off("borrow_completed");
      socket?.off("borrow_rejected");
      socket?.off("borrow_auto_rejected");
    };
  }, [socket, navigate]);

  const handleBorrowSubmit = async (formData) => {
    try {
      const response = await borrowAPI.submitRequest({
        nama_mahasiswa: formData.nama_mahasiswa,
        nim_mahasiswa: formData.nim_mahasiswa,
        nama_dosen: formData.nama_dosen,
        kelas: formData.kelas,
        nama_prodi: formData.nama_prodi,
        jadwal_id: formData.jadwal_id,
        waktu_pengembalian_dijanjikan: formData.waktu_pengembalian_dijanjikan,
        id_barang: formData.id_barang,
      });

      setBorrowerData({
        nama_mahasiswa: formData.nama_mahasiswa,
        nim_mahasiswa: formData.nim_mahasiswa,
      });
      setCurrentTransaction(response.data);
      joinStudentRoom(formData.nim_mahasiswa);
      setLendModal(false);
      setWaitingForAcceptance(true);

      alert(`Permintaan peminjaman berhasil di ajukan!`);
    } catch (error) {
      console.error("Error submiting borrow request: ", error);
      alert("Gagal mengajukan permintaan peminjaman");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentLendModal
        isOpen={lendModal}
        onClose={() => navigate("/")}
        onSubmit={handleBorrowSubmit}
        modalType={modalType}
        setModalType={setModalType}
      />

      {/* waiting for admin acceptance */}
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
                  Permintaan peminjaman anda sedang diproses. Silahkan menuju ke
                  meja admin
                </p>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>ID Transaksi: </strong>
                    {currentTransaction?.transaction_id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Nama: </strong>
                    {borrowerData?.nama_mahasiswa}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>NIM: </strong>
                    {borrowerData?.nim_mahasiswa}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md font-medium"
                >
                  Kembali ke beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* waiting for admin to scan barcode */}
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
                  Terima barang dari admin
                </h2>
                <p className="text-gray-600 mb-4">
                  Admin sedang memproses peminjaman. Tunggu sebentar...
                </p>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>ID Transaksi: </strong>
                    {currentTransaction?.transaction_id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Nama: </strong>
                    {borrowerData?.nama_mahasiswa}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>NIM: </strong>
                    {borrowerData?.nim_mahasiswa}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* transaction successfully */}
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
                  Barang berhasil dipinjam!
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
                    <strong>Barang: </strong>
                    {currentTransaction?.transaction?.tipe_nama_barang}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Brand: </strong>
                    {currentTransaction?.transaction?.brand}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Model: </strong>
                    {currentTransaction?.transaction?.model}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Modal akan tertutup otomatis
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
