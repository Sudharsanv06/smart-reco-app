const Interaction = require("../models/Interaction")

exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id

    const interactions = await Interaction.find({ userId })
      .populate("resourceId")
      .lean()

    if (!interactions.length) {
      return res.json({
        totalInteractions: 0,
        views: 0,
        saves: 0,
        likes: 0,
        savedResourceCount: 0,
        topTags: [],
      })
    }

    let views = 0
    let saves = 0
    let likes = 0

    const savedResourceIds = new Set()
    const tagCountMap = {}

    interactions.forEach((i) => {
      if (i.action === "view") views++
      if (i.action === "save") {
        saves++
        if (i.resourceId?._id) {
          savedResourceIds.add(i.resourceId._id.toString())
        }
      }
      if (i.action === "like") likes++

      const tags = i.resourceId?.tags || []
      tags.forEach((tag) => {
        const key = tag.toLowerCase()
        tagCountMap[key] = (tagCountMap[key] || 0) + 1
      })
    })

    const totalInteractions = interactions.length
    const savedResourceCount = savedResourceIds.size

    const topTags = Object.entries(tagCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    return res.json({
      totalInteractions,
      views,
      saves,
      likes,
      savedResourceCount,
      topTags,
    })
  } catch (err) {
    console.error("User analytics error:", err)
    return res
      .status(500)
      .json({ message: "Failed to fetch user analytics" })
  }
}
