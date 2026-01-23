import axios from "./axios";

export const analyticsApi = {
  getOverview: () => axios.get("/analytics/overview"),
  getEmployeeStats: () => axios.get("/analytics/employees"),
  getTaskStats: () => axios.get("/analytics/tasks"),
};
