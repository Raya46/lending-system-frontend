import { useState } from "react";
import { borrowAPI, dashboardAPI } from "../utils/api";
import { useEffect } from "react";

export const useDashboardData = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dashboardData, setDashboardData] = useState({
    topLendingItems: [],
    lowStockItems: [],
    inventoryData: [],
    inventorySummary: { quantityInHand: 0, toBeReceived: 0 },
    pendingRequests: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = async (page = currentPage) => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true, error: null }));
      const [
        topLendingResponse,
        lowStockResponse,
        inventoryResponse,
        summaryResponse,
        pendingRequestResponse,
      ] = await Promise.all([
        dashboardAPI.getTopLendingItems(),
        dashboardAPI.getLowStockItems(),
        dashboardAPI.getInventoryData(page, itemsPerPage),
        dashboardAPI.getInventorySummary(),
        borrowAPI.getPendingRequests(),
      ]);

      setDashboardData({
        topLendingItems: topLendingResponse.data || [],
        lowStockItems: lowStockResponse.data || [],
        inventoryData: inventoryResponse.data || [],
        inventorySummary: summaryResponse.data || {
          quantityInHand: 0,
          toBeReceived: 0,
        },
        pendingRequests: pendingRequestResponse.data || [],
        loading: false,
        error: null,
      });
      setTotalPages(inventoryResponse.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load dashboard data",
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const refreshPendingRequests = async () => {
    try {
      const pendingResponse = await borrowAPI.getPendingRequests();
      setDashboardData((prev) => ({
        ...prev,
        pendingRequests: pendingResponse.data || [],
      }));
    } catch (error) {
      console.error("Error refreshing pending requests: ", error);
    }
  };

  return {
    dashboardData,
    setDashboardData,
    fetchDashboardData,
    refreshPendingRequests,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
