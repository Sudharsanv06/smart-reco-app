const User = require("../models/User")
const Resource = require("../models/Resource")

function getPreferredDifficulty(year) {
  if (!year) return null
  if (year <= 2) return "beginner"
  if (year === 3) return "intermediate"
  return "advanced"
}

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const allResources = await Resource.find().lean()

    if (allResources.length === 0) {
      return res.json({ resources: [] })
    }

    const userInterests = user.interests || []
    const preferredDifficulty = getPreferredDifficulty(user.year)

    const scored = allResources.map((resDoc) => {
      let score = 0

      if (Array.isArray(resDoc.tags) && userInterests.length > 0) {
        const lowerTags = resDoc.tags.map((t) => t.toLowerCase())
        const lowerInterests = userInterests.map((i) => i.toLowerCase())

        const matches = lowerTags.filter((tag) => lowerInterests.includes(tag))
        score += matches.length * 2
      }

      if (
        preferredDifficulty &&
        resDoc.difficulty &&
        resDoc.difficulty === preferredDifficulty
      ) {
        score += 1
      }

      if (
        Array.isArray(resDoc.tags) &&
        user.branch &&
        resDoc.tags
          .map((t) => t.toLowerCase())
          .includes(user.branch.toLowerCase())
      ) {
        score += 0.5
      }

      if (typeof resDoc.rating === "number") {
        score += resDoc.rating
      }

      if (resDoc.createdAt) {
        const createdTime = new Date(resDoc.createdAt).getTime()
        const now = Date.now()
        const daysOld = (now - createdTime) / (1000 * 60 * 60 * 24)
        if (daysOld < 7) score += 1
        else if (daysOld < 30) score += 0.5
      }

      return { ...resDoc, _score: score }
    })

    scored.sort((a, b) => b._score - a._score)

    const allZero = scored.every((r) => r._score === 0)
    let finalList
    if (allZero) {
      finalList = allResources
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else {
      finalList = scored
    }

    const topN = 10
    const recommendations = finalList.slice(0, topN)

    return res.json({ resources: recommendations })
  } catch (err) {
    console.error("Recommendations error:", err)
    return res
      .status(500)
      .json({ message: "Failed to generate recommendations" })
  }
}
