# Lending System Documentation

## Overview

Lending System adalah aplikasi web berbasis React.js (frontend) dan Node.js dengan Express.js (backend) untuk mengelola peminjaman dan pengembalian barang inventaris. Sistem ini mendukung peminjaman oleh mahasiswa dan dosen, dengan fitur autentikasi admin, real-time notifications, dan tracking barang yang dipinjam.

## Architecture

### Frontend (React.js)

- **Framework**: React.js dengan Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Real-time Communication**: Socket.IO Client
- **HTTP Client**: Fetch API dengan custom wrapper

### Backend (Node.js)

- **Framework**: Express.js
- **Database**: MySQL dengan connection pooling
- **Real-time Communication**: Socket.IO Server
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: Multer untuk upload Excel

## Project Structure

```
lending_system_2/
├── lending-system-backend-2/          # Backend Application
│   ├── controllers/                   # Request Handlers
│   ├── services/                      # Business Logic
│   ├── routes/                        # API Routes
│   ├── utils/                         # Utility Functions
│   ├── data/                          # Database Configuration
│   └── express.js                     # Main Application File
└── lending-system-frontend-2/         # Frontend Application
    ├── src/
    │   ├── pages/                     # Page Components
    │   ├── components/                # Reusable Components
    │   ├── hooks/                     # Custom Hooks
    │   └── utils/                     # Utility Functions
    └── public/                        # Static Assets
```

---

## Backend Documentation

### 1. Main Application File

#### `express.js`

File utama yang menginisialisasi server Express.js dan middleware.

```javascript
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
```

**Key Features:**

- **CORS Configuration**: Mengizinkan frontend pada `http://localhost:5173`
- **Socket.IO Setup**: Konfigurasi real-time communication
- **Route Registration**: Mendaftarkan semua API routes
- **Automated Tasks**: setInterval untuk update otomatis setiap 10 menit

**Automated Tasks:**

```javascript
setInterval(async () => {
  try {
    await updateOverdueItems(); // Update status terlambat
    await autoRejectAllExpiredRequests(); // Tolak permintaan kadaluarsa
  } catch (error) {
    console.error("Error running overdue items update job:", error);
  }
}, 10 * 60 * 1000); // Setiap 10 menit
```

### 2. Database Configuration

#### `data/db_setting.js`

Konfigurasi koneksi database MySQL dengan connection pooling.

```javascript
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lending_system_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

**Features:**

- **Connection Pooling**: Maksimal 10 koneksi simultan
- **Automatic Reconnection**: Menangani koneksi yang terputus
- **Environment Variables**: Konfigurasi flexible dengan .env

### 3. API Routes

#### `routes/adminRoutes.js`

Route untuk admin-related endpoints.

**Authentication Middleware:**

```javascript
router.post("/login", AdminController.login);
router.get("/inventory", authMiddleware, AdminController.getInventoryData);
```

**Key Endpoints:**

- `POST /admin/login` - Login admin
- `GET /admin/inventory` - Get inventory data dengan pagination
- `GET /admin/history-log` - Get semua transaksi
- `POST /admin/return-item` - Return item by barcode
- `POST /admin/return-item-by-transaction` - Return item by transaction ID

**File Upload Support:**

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    // Filter untuk Excel files (.xlsx, .xls)
  },
});
```

#### `routes/borrowRoutes.js`

Route untuk peminjaman-related endpoints.

**Key Endpoints:**

- `POST /borrow/request` - Submit permintaan peminjaman
- `GET /borrow/pending-requests` - Get permintaan pending
- `PUT /borrow/accept/:id` - Accept permintaan peminjaman
- `PUT /borrow/complete/:id` - Complete transaksi peminjaman
- `PUT /borrow/reject/:id` - Reject permintaan peminjaman

### 4. Controllers

#### `controllers/adminController.js`

Handler untuk admin-related requests.

**Login Method:**

```javascript
static async login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "validation error",
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;
  const result = await AdminService.login(username, password);
  // Return JWT token
}
```

**Return Item Methods:**

```javascript
// Return by barcode
static async returnItem(req, res) {
  const { barcode } = req.body;
  const adminId = req.admin.admin_id;
  const result = await AdminService.returnItemByBarcode(barcode, adminId);
}

// Return by transaction ID
static async returnItemByTransaction(req, res) {
  const { transactionId, notes } = req.body;
  const adminId = req.admin.admin_id;
  const result = await AdminService.returnItem(transactionId, adminId, notes);
}
```

#### `controllers/borrowController.js`

Handler untuk borrowing requests.

**Request Validation:**

```javascript
static async submitRequest(req, res) {
  const requestData = {
    nama_mahasiswa, nim_mahasiswa,
    nama_dosen, nip_dosen,
    kelas, nama_prodi,
    jadwal_id, waktu_pengembalian_dijanjikan,
    id_barang
  };

  const result = await BorrowService.submitBorrowRequest(requestData);
}
```

### 5. Services (Business Logic)

#### `services/adminService.js`

Business logic untuk admin operations.

**Login Service:**

```javascript
static async login(username, password) {
  const [users] = await pool.execute(
    "SELECT * FROM admin_users WHERE username = ?",
    [username]
  );

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  const token = jwt.sign(
    { admin_id: user.admin_id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "rahasia",
    { expiresIn: "24h" }
  );

  return { token, admin: { admin_id, username, nama_lengkap, role } };
}
```

**Return Item Services:**

```javascript
// Return by barcode
static async returnItemByBarcode(barcode, adminId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Find item by barcode
    const [itemData] = await connection.execute(`
      SELECT i.id_barang, i.tipe_nama_barang, i.barcode, t.peminjaman_id
      FROM inventory i
      JOIN transaksi t ON i.id_barang = t.id_barang
      WHERE i.barcode = ? AND t.status_peminjaman IN ('dipinjam', 'terlambat')
    `, [barcode]);

    // Update transaction status
    await connection.execute(`
      UPDATE transaksi
      SET status_peminjaman = 'dikembalikan',
          admin_id_checkin = ?,
          waktu_pengembalian_sebenarnya = NOW(),
          notes_checkin = 'Dikembalikan secara manual oleh admin'
      WHERE peminjaman_id = ?
    `, [adminId, item.peminjaman_id]);

    // Update inventory status
    await connection.execute(`
      UPDATE inventory SET status = 'tersedia' WHERE id_barang = ?
    `, [item.id_barang]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Return by transaction ID
static async returnItem(transactionId, adminId, notes = "") {
  // Similar logic but uses transactionId instead of barcode
  // Includes socket notifications
  emitToStudent(borrowerIdentifier, "item_returned", {
    transaction_id: transactionId,
    item_name: completeTransaction.tipe_nama_barang,
    return_date: completeTransaction.waktu_pengembalian_sebenarnya,
    notes: notes || "Dikembalikan oleh admin"
  });
}
```

#### `services/borrowService.js`

Business logic untuk borrowing operations.

**Submit Request Method:**

```javascript
static async submitBorrowRequest(requestData) {
  // Determine borrower type (student or lecturer)
  let borrowerNim, borrowerNip, borrowerName, borrowerType;

  if (nama_mahasiswa && nim_mahasiswa) {
    borrowerType = "student";
    borrowerNim = nim_mahasiswa;
  } else if (nama_dosen && nip_dosen) {
    borrowerType = "lecturer";
    borrowerNip = nip_dosen;
  }

  // Validate schedule eligibility
  if (borrowerType === "student") {
    await validateBorrowEligibility(nim_mahasiswa, jadwal_id, returnDate);
  } else {
    await validateLecturerBorrowEligibility(nip_dosen, jadwal_id, returnDate);
  }

  // Create pending transaction
  const [transactionResult] = await connection.execute(`
    INSERT INTO transaksi
    (nim, nip, jadwal_id, id_barang, waktu_pengembalian_dijanjikan,
     status_peminjaman, notes_checkout, nama_prodi)
    VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
  `, [borrowerNim, borrowerNip, jadwal_id, id_barang,
      mysqlDateTime, JSON.stringify(requestMetadata), nama_prodi]);

  // Set auto-rejection timer (15 minutes)
  setTimeout(async () => {
    await autoRejectExpiredRequest(transactionId);
  }, 15 * 60 * 1000);
}
```

### 6. Utility Functions

#### `utils/borrowUtils.js`

Utility functions untuk borrowing operations.

**Auto-reject Expired Requests:**

```javascript
export async function autoRejectAllExpiredRequests() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Find expired pending transactions
    const [expiredTransactions] = await connection.execute(`
      SELECT t.peminjaman_id, t.nim, t.notes_checkout, m.nama_mahasiswa
      FROM transaksi t
      JOIN mahasiswa m ON t.nim = m.nim
      WHERE t.status_peminjaman = 'pending'
        AND t.waktu_pengembalian_dijanjikan <= NOW()
    `);

    // Update all expired transactions
    const transactionIds = expiredTransactions.map((t) => t.peminjaman_id);
    await connection.execute(
      `
      UPDATE transaksi
      SET status_peminjaman = 'dikembalikan',
          notes_checkin = 'Otomatis ditolak: Tidak datang dalam waktu 15 menit',
          waktu_pengembalian_sebenarnya = NOW()
      WHERE peminjaman_id IN (${transactionIds.map(() => "?").join(",")})
    `,
      transactionIds
    );

    await connection.commit();

    // Notify students and admins via socket
    expiredTransactions.forEach((transaction) => {
      emitToStudent(transaction.nim, "borrow_auto_rejected", {
        transaction_id: transaction.peminjaman_id,
        reason: "Tidak datang ke admin dalam waktu 15 menit",
      });
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

**Update Overdue Items:**

```javascript
export async function updateOverdueItems() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Find items past due date
    const [overdueItems] = await connection.execute(`
      SELECT t.peminjaman_id, t.nim, m.nama_mahasiswa, 
             i.barcode, i.tipe_nama_barang, t.waktu_pengembalian_dijanjikan,
             TIMESTAMPDIFF(DAY, t.waktu_pengembalian_dijanjikan, NOW()) as days_overdue
      FROM transaksi t
      JOIN mahasiswa m ON t.nim = m.nim
      JOIN inventory i ON t.id_barang = i.id_barang
      WHERE t.status_peminjaman = 'dipinjam'
        AND t.waktu_pengembalian_dijanjikan < NOW()
    `);

    // Update status to "terlambat"
    const transactionIds = overdueItems.map((item) => item.peminjaman_id);
    await connection.execute(
      `
      UPDATE transaksi
      SET status_peminjaman = 'terlambat',
          notes_checkin = CONCAT(COALESCE(notes_checkin, ''), 
                               ' | Status otomatis: dikembalikan (terlambat)')
      WHERE peminjaman_id IN (${transactionIds.map(() => "?").join(",")})
    `,
      transactionIds
    );

    await connection.commit();

    // Send notifications
    overdueItems.forEach((item) => {
      emitToStudent(item.nim, "item_overdue", {
        transaction_id: item.peminjaman_id,
        item_name: item.tipe_nama_barang,
        days_overdue: item.days_overdue,
      });
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

**Borrow Eligibility Validation:**

```javascript
export async function validateBorrowEligibility(
  nim_mahasiswa,
  jadwal_id,
  returnDate
) {
  const connection = await pool.getConnection();

  try {
    // Validate student exists
    const [studentData] = await connection.execute(
      "SELECT nama_prodi FROM mahasiswa WHERE nim = ?",
      [nim_mahasiswa]
    );

    // Validate schedule
    const [scheduleData] = await connection.execute(
      `
      SELECT j.id_jadwal, j.nama_prodi, j.hari_dalam_seminggu,
             j.waktu_mulai, j.waktu_berakhir, k.nama_kelas,
             d.nama_dosen, r.nomor_ruangan
      FROM jadwal j
      JOIN kelas k ON j.id_kelas = k.id_kelas
      JOIN dosen d ON j.nip = d.nip
      JOIN ruangan r ON j.id_ruangan = r.id_ruangan
      WHERE j.id_jadwal = ?
    `,
      [jadwal_id]
    );

    // Validate program study match
    if (schedule.nama_prodi !== nama_prodi) {
      throw new Error(`Jadwal ini untuk program studi ${schedule.nama_prodi}`);
    }

    // Validate schedule day matches today
    const today = new Date();
    const todayDayIndex = today.getDay();
    const dayMap = {
      Minggu: 0,
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
    };

    const scheduleDayIndex = dayMap[schedule.hari_dalam_seminggu];
    if (scheduleDayIndex !== todayDayIndex) {
      throw new Error(`Jadwal ini untuk hari ${schedule.hari_dalam_seminggu}`);
    }

    // Validate return date is in future
    const returnDateTime = new Date(returnDate);
    if (returnDateTime <= now) {
      throw new Error("Waktu pengembalian harus di waktu selanjutnya");
    }

    return { valid: true, schedule };
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}
```

---

## Frontend Documentation

### 1. Main Application Files

#### `src/main.jsx`

Entry point aplikasi React.

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### `src/App.jsx`

Main application component dengan routing.

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./utils/socket.jsx";

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}
```

### 2. Utility Functions

#### `src/utils/api.js`

Centralized API client dengan authentication.

```javascript
const BASE_API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_API_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};
```

**API Modules:**

```javascript
export const dashboardAPI = {
  getTopLendingItems: () => apiCall("/admin/top-lending-items"),
  getLowStockItems: () => apiCall("/admin/low-stock-items"),
  getInventoryData: (page = 1, limit = 10) =>
    apiCall(`/admin/inventory?page=${page}&limit=${limit}`),
  getHistoryLog: (page = 1, limit = 10) =>
    apiCall(`/admin/history-log?page=${page}&limit=${limit}`),
  returnItemByTransaction: (transactionId, notes) =>
    apiCall("/admin/return-item-by-transaction", {
      method: "POST",
      body: JSON.stringify({ transactionId, notes }),
    }),
  returnItemByBarcode: (barcode, notes) => {
    const token = localStorage.getItem("token");
    return fetch("http://localhost:3000/api/admin/return-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ barcode, notes }),
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            data.message || `HTTP error! status: ${response.status}`
          );
        });
      }
      return response.json();
    });
  },
};

export const borrowAPI = {
  submitRequest: (requestData) =>
    apiCall("/borrow/request", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),
  getPendingRequests: () => apiCall("/borrow/pending-requests"),
  acceptRequest: (transactionId) =>
    apiCall(`/borrow/accept/${transactionId}`, { method: "PUT" }),
  completeTransaction: (transactionId, data) =>
    apiCall(`/borrow/complete/${transactionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
```

#### `src/utils/socket.jsx`

Socket.IO client untuk real-time communication.

```javascript
import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
```

### 3. Custom Hooks

#### `src/hooks/useDashboardSocket.js`

Hook untuk mengelola socket events pada dashboard admin.

```javascript
import { useEffect } from "react";
import { useSocket } from "../utils/socket.jsx";

export const useDashboardSocket = (onDataUpdate) => {
  const { socket, joinAdminRoom } = useSocket();

  useEffect(() => {
    // Join admin room for notifications
    joinAdminRoom();

    // Listen for various events
    socket?.on("new_borrow_request", onDataUpdate);
    socket?.on("request_processed", onDataUpdate);
    socket?.on("borrow_auto_rejected", onDataUpdate);
    socket?.on("direct_lending_completed", onDataUpdate);
    socket?.on("items_overdue", onDataUpdate);
    socket?.on("item_returned", onDataUpdate);

    // Cleanup
    return () => {
      socket?.off("new_borrow_request");
      socket?.off("request_processed");
      socket?.off("borrow_auto_rejected");
      socket?.off("direct_lending_completed");
      socket?.off("items_overdue");
      socket?.off("item_returned");
    };
  }, [socket, joinAdminRoom, onDataUpdate]);

  return { socket };
};
```

### 4. Page Components

#### `src/pages/AdminHistoryLog.jsx`

Halaman untuk menampilkan log transaksi peminjaman.

```javascript
const AdminHistoryLog = () => {
  const { socket, joinAdminRoom } = useSocket();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // Fetch history data
  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getHistoryLog(currentPage, itemsPerPage);
      if (data.success) {
        setHistoryData(data.data);
        setTotalPages(data.pagination?.total_pages);
      }
    } catch (error) {
      setError(error.message || "Failed to load history data");
    } finally {
      setLoading(false);
    }
  };

  // Handle return item
  const handleReturnItem = (transaction) => {
    setSelectedTransactionId(transaction.peminjaman_id);
    setIsReturnModalOpen(true);
  };

  // Socket event listeners
  useEffect(() => {
    joinAdminRoom();

    socket?.on("new_borrow_request", fetchHistoryData);
    socket?.on("request_processed", fetchHistoryData);
    socket?.on("borrow_auto_rejected", fetchHistoryData);
    socket?.on("direct_lending_completed", fetchHistoryData);
    socket?.on("items_overdue", fetchHistoryData);
    socket?.on("item_returned", fetchHistoryData);

    return () => {
      socket?.off("new_borrow_request");
      socket?.off("request_processed");
      socket?.off("borrow_auto_rejected");
      socket?.off("direct_lending_completed");
      socket?.off("items_overdue");
      socket?.off("item_returned");
    };
  }, [socket, joinAdminRoom, fetchHistoryData]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchPlaceholder="Search history..." />
        <div className="flex-1 overflow-y-auto">
          <HistoryLogContent />
        </div>
      </div>

      {/* Return Item Modal */}
      <BarcodeScannerModal
        isOpen={isReturnModalOpen}
        onClose={handleCloseReturnModal}
        onSuccess={handleReturnSuccess}
        transactionId={selectedTransactionId}
        mode="return"
      />
    </div>
  );
};
```

#### `src/pages/LandingPage.jsx`

Halaman landing dengan perbaikan tampilan gambar.

```javascript
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Fixed image container to prevent stretching */}
          <div className="w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            <img
              src="/PEENJE.png"
              alt="PEENJE Logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lending System
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Sistem peminjaman barang inventaris yang modern dan efisien
          </p>

          <div className="space-x-4">
            <Link
              to="/admin/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login Admin
            </Link>
            <Link
              to="/borrow"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Pinjam Barang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 5. Reusable Components

#### `src/pages/components/BarcodeScannerModal.jsx`

Modal komprehensif untuk scan barcode dengan dual mode.

```javascript
export default function BarcodeScannerModal({
  isOpen,
  onClose,
  transactionId,
  onSuccess,
  mode = "borrow", // "borrow" or "return"
}) {
  const [barcode, setBarcode] = useState("");
  const [scannedItem, setScannedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [notes, setNotes] = useState("");
  const inputRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  // Hardware scanner detection
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      if (document.activeElement === inputRef.current) {
        setIsScanning(true);

        scanTimeoutRef.current = setTimeout(() => {
          if (barcode.trim() && isScanning) {
            handleScan(barcode);
          }
        }, 500); // Wait 500ms after last keystroke
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Enter" && document.activeElement === inputRef.current) {
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }
        if (barcode.trim()) {
          handleScan(barcode);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isOpen, barcode, isScanning, scannedItem]);

  // Scan logic
  const handleScan = async (scannedBarcode = null) => {
    const barcodeToScan = scannedBarcode || barcode;
    if (!barcode.trim()) {
      setError("Please enter a barcode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "return") {
        // For return mode, just validate barcode exists
        setScannedItem({ barcode: barcodeToScan });
        setBarcode(barcodeToScan);
      } else {
        // Original borrow mode logic
        const response = await borrowAPI.scanBarcode(barcodeToScan);
        setScannedItem(response.data);
        setBarcode(barcodeToScan);
      }
    } catch (error) {
      setError(error.response?.data?.message || "failed to scan barcode");
    } finally {
      setLoading(false);
      setIsScanning(false);
    }
  };

  // Confirm action
  const handleConfirm = async () => {
    if (!scannedItem) return;

    try {
      setLoading(true);

      if (mode === "return") {
        // Return mode - call return item API
        await dashboardAPI.returnItemByBarcode(scannedItem.barcode, notes);
        onSuccess && onSuccess(scannedItem.barcode);
      } else {
        // Borrow mode logic
        await borrowAPI.completeTransaction(transactionId, {
          item_id: scannedItem.id_barang,
          waktu_pengembalian: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(),
        });
        onSuccess && onSuccess();
      }

      onClose();
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${mode} item`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === "return"
                ? "Return Item - Scan Barcode"
                : "Scan barcode"}
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400"
            >
              x
            </button>
          </div>

          {!scannedItem ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Barcode
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Enter or scan barcode"
                  className={`w-full px-3 py-2.5 border-gray-300 rounded-md ${
                    isScanning ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                  onKeyPress={(e) => e.key === "Enter" && handleScan()}
                />
              </div>

              {isScanning && (
                <div className="text-xs text-blue-600 mt-1">
                  Scanning... Hardware scanner detected
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 text-white rounded-md transition-all font-medium"
                  style={{ backgroundColor: "#048494" }}
                >
                  {loading ? "Scanning" : "Scan"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  {mode === "return" ? "Barcode Ready" : "Item found"}
                </h3>
                <div className="space-y-1 text-sm text-green-700">
                  {mode === "return" ? (
                    <p>
                      <strong>Barcode: </strong> {scannedItem.barcode}
                    </p>
                  ) : (
                    <>
                      <p>
                        <strong>Name: </strong> {scannedItem.tipe_nama_barang}
                      </p>
                      <p>
                        <strong>Brand: </strong> {scannedItem.brand}
                      </p>
                      <p>
                        <strong>Model: </strong> {scannedItem.model}
                      </p>
                      <p>
                        <strong>Barcode: </strong> {scannedItem.barcode}
                      </p>
                      <p>
                        <strong>Status: </strong> {scannedItem.status}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {mode === "return" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the return"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetScanner}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-700 transition-colors font-medium"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 text-white rounded-md transition-all font-medium disabled:opacity-50"
                  style={{
                    backgroundColor: mode === "return" ? "#10b981" : "#048494",
                  }}
                >
                  {loading
                    ? "Processing..."
                    : mode === "return"
                    ? "Return Item"
                    : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Database Schema

### Key Tables

#### `transaksi`

Menyimpan data transaksi peminjaman.

```sql
CREATE TABLE transaksi (
  peminjaman_id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20),
  nip VARCHAR(20),
  jadwal_id INT,
  id_barang INT,
  waktu_checkout DATETIME,
  waktu_pengembalian_dijanjikan DATETIME,
  waktu_pengembalian_sebenarnya DATETIME,
  status_peminjaman ENUM('pending', 'accepted', 'dipinjam', 'terlambat', 'dikembalikan'),
  admin_id_checkout INT,
  admin_id_checkin INT,
  notes_checkout JSON,
  notes_checkin TEXT,
  nama_prodi VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `inventory`

Menyimpan data barang inventaris.

```sql
CREATE TABLE inventory (
  id_barang INT AUTO_INCREMENT PRIMARY KEY,
  tipe_nama_barang VARCHAR(255),
  brand VARCHAR(100),
  model VARCHAR(100),
  barcode VARCHAR(100) UNIQUE,
  status ENUM('tersedia', 'dipinjam', 'diperbaiki'),
  tanggal_pembelian DATE
);
```

#### `mahasiswa`

Data mahasiswa.

```sql
CREATE TABLE mahasiswa (
  nim VARCHAR(20) PRIMARY KEY,
  nama_mahasiswa VARCHAR(255),
  nama_prodi VARCHAR(100),
  mahasiswa_aktif BOOLEAN DEFAULT TRUE
);
```

#### `dosen`

Data dosen.

```sql
CREATE TABLE dosen (
  nip VARCHAR(20) PRIMARY KEY,
  nama_dosen VARCHAR(255),
  prodi VARCHAR(100)
);
```

---

## Features

### 1. Authentication System

- JWT-based authentication untuk admin
- Session management dengan localStorage
- Role-based access control

### 2. Borrowing System

- Peminjaman oleh mahasiswa dan dosen
- Validasi jadwal dan program studi
- Auto-rejection untuk permintaan kadaluarsa (15 menit)
- Real-time notifications

### 3. Inventory Management

- Tracking barang tersedia dan dipinjam
- Barcode scanning support
- Low stock alerts
- Import data mahasiswa dari Excel

### 4. Return System

- Manual return by barcode
- Manual return by transaction ID
- Automatic overdue status update
- Return history tracking

### 5. Real-time Features

- Socket.IO untuk real-time updates
- Live notifications untuk admin dan mahasiswa
- Automatic status updates

### 6. Automated Tasks

- Update status terlambat setiap 10 menit
- Auto-reject permintaan kadaluarsa
- Background job processing

---

## Installation & Setup

### Backend Setup

```bash
cd lending-system-backend-2
npm install
cp .env.example .env
# Configure database credentials in .env
npm start
```

### Frontend Setup

```bash
cd lending-system-frontend-2
npm install
npm run dev
```

### Database Setup

```bash
mysql -u root -p < lending_system_db.sql
```

---

## Environment Variables

### Backend (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lending_system_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## API Endpoints

### Admin Endpoints

- `POST /api/admin/login` - Login admin
- `GET /api/admin/inventory` - Get inventory data
- `GET /api/admin/history-log` - Get transaction history
- `POST /api/admin/return-item` - Return item by barcode
- `POST /api/admin/return-item-by-transaction` - Return item by transaction ID

### Borrow Endpoints

- `POST /api/borrow/request` - Submit borrow request
- `GET /api/borrow/pending-requests` - Get pending requests
- `PUT /api/borrow/accept/:id` - Accept request
- `PUT /api/borrow/complete/:id` - Complete transaction
- `PUT /api/borrow/reject/:id` - Reject request

---

## Socket Events

### Client to Server

- `join_admin_room` - Join admin notification room

### Server to Client

- `new_borrow_request` - New borrow request received
- `request_processed` - Request processed
- `borrow_auto_rejected` - Request auto-rejected
- `direct_lending_completed` - Direct lending completed
- `items_overdue` - Items became overdue
- `item_returned` - Item returned

---

## Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Input Validation** - Server-side validation for all inputs
3. **SQL Injection Prevention** - Using parameterized queries
4. **CORS Configuration** - Proper cross-origin resource sharing setup
5. **File Upload Security** - File type and size validation

---

## Performance Optimizations

1. **Connection Pooling** - Database connection pooling
2. **Pagination** - Large dataset pagination
3. **Caching** - Client-side data caching
4. **Lazy Loading** - Component lazy loading
5. **Debouncing** - Input debouncing for search

---

## Error Handling

1. **Global Error Handler** - Centralized error handling
2. **Validation Errors** - Detailed validation error messages
3. **Database Errors** - Proper database error handling
4. **Network Errors** - Network error recovery
5. **User-friendly Messages** - Clear error messages for users

---

## Testing

### Backend Testing

```bash
npm test
```

### Frontend Testing

```bash
npm run test
```

---

## Deployment

### Production Build

```bash
# Frontend
cd lending-system-frontend-2
npm run build

# Backend
cd lending-system-backend-2
npm run start
```

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For support and questions, please contact the development team.
