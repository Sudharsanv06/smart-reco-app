import axiosInstance from "./axiosInstance"

export async function fetchUserAnalytics() {
  const res = await axiosInstance.get("/analytics/user")
  return res.data
}
