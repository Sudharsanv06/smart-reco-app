import axiosInstance from "./axiosInstance"

export async function fetchResources(params = {}) {
  const res = await axiosInstance.get("/resources", { params })
  return res.data
}

export async function fetchRecommendations() {
  const res = await axiosInstance.get("/recommendations")
  return res.data
}
