export default function PendingRequests({
  pendingRequests,
  onAcceptRequest,
  onRejectRequest,
  onBarcodeScan,
}) {
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return "Expired";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2>Pending Borrow Requests</h2>
          <span>{pendingRequests.length} pending</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        {pendingRequests.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th>Student</th>
                <th>Program Studi</th>
                <th>Lecturer</th>
                <th>Class</th>
                <th>Time Remaining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request) => (
                <tr>
                  <td>
                    <div>{request.nama_mahasiswa}</div>
                    <div>NIM: {request.nim}</div>
                  </td>
                  <td>
                    <div>{request.nama_prodi}</div>
                  </td>
                  <td>
                    <div>{request.lecturer_name}</div>
                  </td>
                  <td>
                    <div>{request.class_name}</div>
                  </td>
                  <td>
                    <div>{formatTimeRemaining(request.seconds_remaingin)}</div>
                  </td>
                  <td>
                    <div className="flex spacex-2">
                      {request.status_peminjaman === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              onAcceptRequest(request.peminjaman_id);
                            }}
                          >
                            accept
                          </button>
                          <button
                            onClick={() => {
                              onRejectRequest(request.peminjaman_id);
                            }}
                          >
                            reject
                          </button>
                        </>
                      ) : request.status_peminjaman === "accepted" ? (
                        request.student_arrived ? (
                          <button
                            onClick={() => {
                              onBarcodeScan(request.peminjaman_id);
                            }}
                          >
                            scan barcode
                          </button>
                        ) : (
                          <span>waiting for student</span>
                        )
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>no pending borrow requests</div>
        )}
      </div>
    </div>
  );
}
