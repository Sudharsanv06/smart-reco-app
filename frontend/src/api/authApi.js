import axiosInstance from "./axiosInstance"

export async function registerUser(payload) {
  const res = await axiosInstance.post("/auth/register", payload)
  return res.data
}

export async function loginUser(payload) {
  const res = await axiosInstance.post("/auth/login", payload)
  return res.data
}
