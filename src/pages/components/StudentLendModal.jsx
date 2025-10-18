import { useState, useEffect } from "react";
import { dropdownAPI, inventoryAPI } from "../../utils/api.js";

const StudentLendModal = ({
  isOpen,
  onClose,
  onSubmit,
  borrowerData,
  modalType,
  setModalType,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [programStudies, setProgramStudies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [formData, setFormData] = useState({
    nama_mahasiswa: borrowerData?.nama_mahasiswa || "",
    nim_mahasiswa: borrowerData?.nim_mahasiswa || "",
    nama_dosen: "",
    kelas: "",
    nama_prodi: "",
    jadwal_id: "",
    waktu_pengembalian_dijanjikan: "",
    id_barang: "",
  });

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [
          lecturersResponse,
          classesResponse,
          programStudiesResponse,
          schedulesResponse,
          availableItemsResponse,
        ] = await Promise.all([
          dropdownAPI.getLecturers(),
          dropdownAPI.getClasses(),
          dropdownAPI.getProgramStudies(),
          dropdownAPI.getActive(),
          inventoryAPI.getAvailable(),
        ]);

        setLecturers(lecturersResponse.data || []);
        setMataKuliah(classesResponse.data || []);
        setProgramStudies(programStudiesResponse.data || []);
        setSchedules(schedulesResponse.data || []);
        setAvailableItems(availableItemsResponse.data || []);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };

    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleSelect = (scheduleId) => {
    const schedule = schedules.find(
      (s) => s.id_jadwal === parseInt(scheduleId)
    );
    setSelectedSchedule(schedule);
    setFormData((prev) => ({
      ...prev,
      jadwal_id: scheduleId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                Lend to
              </span>

              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full hover:opacity-90 transition-colors font-medium text-sm"
                  style={{ backgroundColor: "#e6f7f9", color: "#036570" }}
                >
                  <span>
                    {modalType === "student" ? "Student" : "Lecturer"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px] z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setModalType("student");
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        modalType === "student" ? "" : "text-gray-700"
                      }`}
                      style={
                        modalType === "student"
                          ? { backgroundColor: "#e6f7f9", color: "#036570" }
                          : {}
                      }
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalType("lecturer");
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        modalType === "lecturer" ? "" : "text-gray-700"
                      }`}
                      style={
                        modalType === "lecturer"
                          ? { backgroundColor: "#e6f7f9", color: "#036570" }
                          : {}
                      }
                    >
                      Lecturer
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nama Mahasiswa
              </label>
              <input
                type="text"
                name="nama_mahasiswa"
                value={formData.nama_mahasiswa}
                onChange={handleInputChange}
                placeholder="Masukkan nama mahasiswa"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                NIM Mahasiswa
              </label>
              <input
                type="text"
                name="nim_mahasiswa"
                value={formData.nim_mahasiswa}
                onChange={handleInputChange}
                placeholder="Masukkan NIM mahasiswa"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nama Dosen
              </label>
              <select
                name="nama_dosen"
                value={formData.nama_dosen}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih dosen</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.nip} value={lecturer.nama_dosen}>
                    {lecturer.nama_dosen}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mata Kuliah
              </label>
              <select
                name="kelas"
                value={formData.kelas}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih mata kuliah</option>
                {mataKuliah.map((mk) => (
                  <option key={mk.id_kelas} value={mk.nama_kelas}>
                    {mk.nama_kelas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Program Studi
              </label>
              <select
                name="nama_prodi"
                value={formData.nama_prodi}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih program studi</option>
                {programStudies.map((ps) => (
                  <option key={ps.nama_prodi} value={ps.nama_prodi}>
                    {ps.kepanjangan_prodi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Item yang Dipinjam
              </label>
              <select
                name="id_barang"
                value={formData.id_barang}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih item yang akan dipinjam</option>
                {availableItems.map((item) => (
                  <option key={item.id_barang} value={item.id_barang}>
                    {item.tipe_nama_barang} - {item.brand} {item.model} (SN:{" "}
                    {item.serial_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Jadwal Mulai
              </label>
              <select
                onChange={(e) => handleScheduleSelect(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih jadwal mulai</option>
                {schedules.map((schedule) => (
                  <option key={schedule.id_jadwal} value={schedule.id_jadwal}>
                    {schedule.hari_dalam_seminggu} {schedule.waktu_mulai}-
                    {schedule.waktu_berakhir} | {schedule.nama_kelas} |{" "}
                    {schedule.nama_dosen}
                  </option>
                ))}
              </select>
            </div>

            {selectedSchedule && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Detail Jadwal:</strong>
                  <br />
                  Dosen: {selectedSchedule.nama_dosen}
                  <br />
                  Mulai: {selectedSchedule.waktu_mulai}
                  <br />
                  Berakhir: {selectedSchedule.waktu_berakhir}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Waktu Pengembalian
              </label>
              <input
                type="datetime-local"
                name="waktu_pengembalian_dijanjikan"
                value={formData.waktu_pengembalian_dijanjikan}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-2.5 px-4 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 py-2.5 px-4 text-white rounded-md hover:opacity-90 transition-all font-medium"
                style={{ backgroundColor: "#048494" }}
              >
                Ajukan Peminjaman
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLendModal;
