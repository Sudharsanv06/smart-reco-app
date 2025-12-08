import axiosInstance from "./axiosInstance"

export async function addInteraction(resourceId, action) {
  return axiosInstance.post("/interactions", {
    resourceId,
    action,
  })
}

export async function fetchMyInteractions() {
  const res = await axiosInstance.get("/interactions/user")
  return res.data
}
