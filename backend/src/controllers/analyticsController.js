const Interaction = require("../models/Interaction")

/**
 * Get user activity analytics and statistics
 * 
 * Aggregates user interaction data to provide insights into learning activity,
 * resource preferences, and topic interests.
 * 
 * @route GET /api/analytics/user
 * @access Protected (requires JWT authentication)
 * 
 * @description
 * Computes:
 * - Total interaction count (all actions)
 * - Breakdown by action type: views, saves, likes
 * - Count of unique saved resources
 * - Top 5 tags from interacted resources (ranked by frequency)
 * 
 * Used by dashboard to display:
 * - Activity cards (interactions, views, saved, likes)
 * - Top topics section (tag chips)
 * 
 * @returns {Object} JSON response with analytics data
 * @returns {number} totalInteractions - Total count of all interactions
 * @returns {number} views - Count of view interactions
 * @returns {number} saves - Count of save interactions
 * @returns {number} likes - Count of like interactions
 * @returns {number} savedResourceCount - Count of unique saved resources
 * @returns {Array} topTags - Top 5 tags [{tag: string, count: number}]
 * 
 * @throws {500} Database error
 * 
 * @example
 * // Request
 * GET /api/analytics/user
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * 
 * // Response
 * {
 *   "totalInteractions": 15,
 *   "views": 8,
 *   "saves": 5,
 *   "likes": 2,
 *   "savedResourceCount": 5,
 *   "topTags": [
 *     { "tag": "ml", "count": 6 },
 *     { "tag": "python", "count": 4 },
 *     { "tag": "tutorial", "count": 3 }
 *   ]
 * }
 */
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id

    // Fetch all user interactions with resource details populated
    const interactions = await Interaction.find({ userId })
      .populate("resourceId")
      .lean()

    // Handle case with no interactions (new user)
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

    // Initialize counters
    let views = 0
    let saves = 0
    let likes = 0

    const savedResourceIds = new Set()
    const tagCountMap = {}

    // Aggregate analytics from interactions
    interactions.forEach((i) => {
      // Count by action type
      if (i.action === "view") views++
      if (i.action === "save") {
        saves++
        // Track unique saved resources
        if (i.resourceId?._id) {
          savedResourceIds.add(i.resourceId._id.toString())
        }
      }
      if (i.action === "like") likes++

      // Extract and count tags from interacted resources
      const tags = i.resourceId?.tags || []
      tags.forEach((tag) => {
        const key = tag.toLowerCase()
        tagCountMap[key] = (tagCountMap[key] || 0) + 1
      })
    })

    const totalInteractions = interactions.length
    const savedResourceCount = savedResourceIds.size

    // Get top 5 tags sorted by frequency
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
