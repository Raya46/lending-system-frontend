import { useState } from "react";
import { borrowAPI, dashboardAPI } from "../utils/api";
import { useEffect } from "react";

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    topLendingItems: [],
    lowStockItems: [],
    inventoryData: [],
    inventorySummary: { quantityInHand: 0, toBeReceived: 0 },
    pendingRequests: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
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
        dashboardAPI.getInventoryData(),
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
    fetchDashboardData;
  }, []);

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
  };
};
