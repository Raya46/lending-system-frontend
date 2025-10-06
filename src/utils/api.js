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
      throw new Error(data.message || `HTTP error! statys: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const authAPI = {
  login: (credentials) =>
    apiCall("/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};

export const dashboardAPI = {
  getTopLendingItems: () => apiCall("/admin/top-lending-items"),
  getLowStockItems: () => apiCall("/admin/low-stock-items"),
  getInventoryData: () => apiCall("/admin/inventory"),
  getInventorySummary: () => apiCall("/admin/inventory-summary"),
  getClassesOverview: () => apiCall("/admin/classes-overview"),
  getClassesTable: (page = 1, limit = 10) =>
    apiCall(`/admin/classes-table?page=${page}&limit=${limit}`),
  getCurrentLoans: () => apiCall("/admin/current-loans"),
  getHistoryLog: (page = 1, limit = 10) =>
    apiCall(`/admin/history-log?page=${page}&limit=${limit}`),
};

export const borrowAPI = {
  submitRequest: (requestData) =>
    apiCall("/borrow/request", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),

  getPendingRequests: () => apiCall("/borrow/pending-requests"),

  scanBarcode: (barcode) => apiCall(`/borrow/scan/${barcode}`),

  acceptRequest: (transactionId) =>
    apiCall(`/borrow/accept/${transactionId}`, {
      method: "PUT",
    }),

  completeTransaction: (transactionId, data) =>
    apiCall(`/borrow/complete/${transactionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  rejectRequest: (transactionId, reason) =>
    apiCall(`/borrow/reject/${transactionId}`, {
      method: "PUT",
      body: JSON.stringify(reason),
    }),

  directLending: (lendingData) => {
    apiCall("/borrow/direct-lending", {
      method: "POST",
      body: JSON.stringify(lendingData),
    });
  },
};

export const inventoryAPI = {
  getAvailable: () => apiCall("/inventory/available"),
  getAll: (page = 1, limit = 10) =>
    apiCall(`/inventory?page=${page}&limit=${limit}`),
  getById: (id) => apiCall(`/inventory/${id}`),
  create: (itemData) =>
    apiCall("/inventory", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),

  update: (id, itemData) =>
    apiCall(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),

  delete: (id) =>
    apiCall(`/inventory/${id}`, {
      method: "DELETE",
    }),
};

export const classAPI = {
  getClasses: () => apiCall("/admin/classes-overview"),
  getClassDetails: (id) => apiCall(`/class/${id}`),
};

export const dropdownAPI = {
  getClasses: () => apiCall("/admin/classes"),
  getRooms: () => apiCall("/admin/rooms"),
  getLecturers: () => apiCall("/admin/lecturers"),
  getProgramStudies: () => apiCall("/admin/program-studies"),
};
