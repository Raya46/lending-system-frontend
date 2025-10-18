import { useEffect } from "react";
import { useSocket } from "../utils/socket";

export const useDashboardSocket = (
  setDashboardData,
  refreshPendingRequests
) => {
  const { socket, joinAdminRoom } = useSocket();

  useEffect(() => {
    // join admin room for realtime notif
    joinAdminRoom();

    // listen for new borrow request
    socket?.on("new_borrow_request", async (data) => {
      console.log("new borrow request received: ", data);

      await refreshPendingRequests();
    });

    // listen for request acceptance
    socket?.on("student_arrived", (data) => {
      // update request status to accepted and student arrived
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests:
          prev.pendingRequests?.map((req) =>
            req.peminjaman_id === data.transaction_id
              ? { ...req, status_peminjaman: "accepted", student_arrived: true }
              : req
          ) || [],
      }));
      // show notif that student has arrived and item ready for barcode scan
      const borrowerType =
        data.borrower_type === "lecturer" ? "Dosen" : "Mahasiswa";
      const borrowerName =
        data.borrower_name || data.nama_peminjam || "Tidak diketahui";
      alert(
        `${borrowerType} ${borrowerName} telah tiba. Siap untuk scan barcode`
      );
    });

    // listen for direct lending completion
    socket?.on("direct_lending_completed", (data) => {
      console.log("Direct lending completed:", data);
      // No need to update pending requests as direct lending doesn't go through pending
    });

    // listen for request processing updates
    socket?.on("request_processed", (data) => {
      // remove from pending requests
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests:
          prev.pendingRequests?.filter(
            (req) => req.peminjaman_id !== data.transaction_id
          ) || [],
      }));
    });

    // listen for auto rejected request
    socket?.on("borrow_auto_rejected", (data) => {
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests:
          prev.pendingRequests?.filter(
            (req) => req.peminjaman_id !== data.transaction_id
          ) || [],
      }));
    });

    // cleanup listeners on unmount
    return () => {
      socket?.off("new_borrow_request");
      socket?.off("student_arrived");
      socket?.off("request_processed");
      socket?.off("borrow_auto_rejected");
      socket?.off("direct_lending_completed");
    };
  }, [socket, joinAdminRoom, setDashboardData, refreshPendingRequests]);
};
