import axiosInstance from "./axiosInstance"

export async function getProfile() {
  const res = await axiosInstance.get("/user/me")
  return res.data
}

export async function updateProfile(profileData) {
  const res = await axiosInstance.put("/user/me", profileData)
  return res.data
}
