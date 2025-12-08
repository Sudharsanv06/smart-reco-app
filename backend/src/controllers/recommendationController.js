const axios = require("axios")
const User = require("../models/User")
const Resource = require("../models/Resource")
const Interaction = require("../models/Interaction")

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).lean()
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const resources = await Resource.find().lean()
    if (resources.length === 0) {
      return res.json({ resources: [] })
    }

    const interactions = await Interaction.find({ userId }).lean()

    const payload = {
      user: {
        id: user._id.toString(),
        branch: user.branch || null,
        year: user.year || null,
        interests: user.interests || [],
      },
      resources: resources.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        type: r.type,
        tags: r.tags || [],
        difficulty: r.difficulty,
        rating: r.rating,
        createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      })),
      interactions: interactions.map((i) => ({
        resourceId: i.resourceId.toString(),
        action: i.action,
      })),
    }

    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/recommend",
      payload
    )

    const recommendedIds = mlResponse.data.recommended_ids || []

    if (!recommendedIds.length) {
      const recent = resources
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return res.json({ resources: recent })
    }

    const orderMap = new Map()
    recommendedIds.forEach((id, index) => orderMap.set(id, index))

    const filtered = resources.filter((r) =>
      orderMap.has(r._id.toString())
    )

    filtered.sort(
      (a, b) =>
        orderMap.get(a._id.toString()) - orderMap.get(b._id.toString())
    )

    return res.json({ resources: filtered })
  } catch (err) {
    console.error("Recommendations error:", err.message)
    try {
      const resources = await Resource.find().sort({ createdAt: -1 }).lean()
      return res.json({ resources })
    } catch (innerErr) {
      console.error("Fallback error:", innerErr.message)
      return res
        .status(500)
        .json({ message: "Failed to generate recommendations" })
    }
  }
}