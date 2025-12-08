const Interaction = require("../models/Interaction")

exports.addInteraction = async (req, res) => {
  try {
    const userId = req.user.id
    const { resourceId, action } = req.body

    if (!resourceId || !action) {
      return res.status(400).json({ message: "resourceId and action required" })
    }

    if (action === "view") {
      const interaction = await Interaction.create({
        userId,
        resourceId,
        action,
      })
      return res.status(201).json({ interaction })
    }

    let interaction
    try {
      interaction = await Interaction.create({
        userId,
        resourceId,
        action,
      })
    } catch (err) {
      return res.json({ message: "Already exists" })
    }

    return res.status(201).json({ interaction })
  } catch (err) {
    console.error("Add interaction error:", err)
    return res.status(500).json({ message: "Failed to add interaction" })
  }
}

exports.getUserInteractions = async (req, res) => {
  try {
    const userId = req.user.id

    const interactions = await Interaction.find({ userId })
      .populate("resourceId")
      .sort({ createdAt: -1 })

    return res.json({ interactions })
  } catch (err) {
    console.error("Fetch interactions error:", err)
    return res.status(500).json({ message: "Failed to fetch interactions" })
  }
}
