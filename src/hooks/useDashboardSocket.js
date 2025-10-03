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
    socket?.on("request_accepted", (data) => {
      // udpate request status to accepted
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests:
          prev.pendingRequests?.map((req) =>
            req.peminjaman_id === data.transaction_id
              ? { ...req, status_peminjaman: "accepted" }
              : req
          ) || [],
      }));
    });

    // listening for student arrival
    socket?.on("student_arrived", (data) => {
      // udpate request to show student has arrived
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests:
          prev.pendingRequests?.map((req) =>
            req.peminjaman_id === data.transaction_id
              ? { ...req, student_arrived: true }
              : req
          ) || [],
      }));
      // show notif that student has arrived and item ready for barcode scan
      alert(
        `Mahasiswa ${data.student_name} telah tiba. Siap untuk scan barcode`
      );
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
      socket?.off("request_accepted");
      socket?.off("student_arrived");
      socket?.off("request_processed");
      socket?.off("borrow_auto_rejected");
    };
  }, [socket, joinAdminRoom, setDashboardData, refreshPendingRequests]);
};
