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
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Borrow Requests
          </h2>
          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
            {pendingRequests.length} pending
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        {pendingRequests.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Program Studi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lecturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRequests.map((request) => (
                <tr key={request.peminjaman_id} className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.nama_mahasiswa}
                    </div>
                    <div className="text-sm text-gray-500">
                      NIM: {request.nim}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.nama_prodi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.lecturer_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.class_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        request.seconds_remaining <= 300
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatTimeRemaining(request.seconds_remaining)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {request.status_peminjaman === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              onAcceptRequest(request.peminjaman_id);
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                          >
                            accept
                          </button>
                          <button
                            onClick={() => {
                              onRejectRequest(request.peminjaman_id);
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded"
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
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
                          >
                            scan barcode
                          </button>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            waiting for student
                          </span>
                        )
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            no pending borrow requests
          </div>
        )}
      </div>
    </div>
  );
}
