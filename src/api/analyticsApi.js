import axios from "./axios";

// Get HR analytics (example endpoints)
export const analyticsApi = {
  getOverview: () => axios.get("/analytics/overview"),
  getEmployeeStats: () => axios.get("/analytics/employees"),
  getTaskStats: () => axios.get("/analytics/tasks"),
};
