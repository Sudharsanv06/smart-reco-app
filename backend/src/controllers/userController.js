const User = require("../models/User")

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, branch, year, interests } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (branch) updateData.branch = branch
    if (year) updateData.year = year
    if (interests) updateData.interests = interests

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-passwordHash")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
