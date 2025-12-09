const axios = require("axios")
const User = require("../models/User")
const Resource = require("../models/Resource")
const Interaction = require("../models/Interaction")

/**
 * Get personalized recommendations for authenticated user
 * 
 * This controller integrates with the Python ML microservice to generate
 * AI-powered recommendations using content-based filtering.
 * 
 * @route GET /api/recommendations
 * @access Protected (requires JWT authentication)
 * 
 * @description
 * Workflow:
 * 1. Fetch user profile from MongoDB
 * 2. Fetch all available resources
 * 3. Fetch user's interaction history
 * 4. Build payload with user, resources, and interactions data
 * 5. Call ML microservice (Python FastAPI) at http://127.0.0.1:8000/recommend
 * 6. Receive ranked list of resource IDs from ML service
 * 7. Order MongoDB resources by ML rankings
 * 8. Return ordered resources to frontend
 * 
 * @returns {Object} JSON response with ordered resources array
 * @returns {Array} resources - Array of resource objects sorted by recommendation score
 * 
 * @throws {404} User not found
 * @throws {500} ML service unavailable (falls back to recent resources)
 * 
 * @example
 * // Request
 * GET /api/recommendations
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * 
 * // Response
 * {
 *   "resources": [
 *     { "_id": "...", "title": "ML Tutorial", "type": "video", ... },
 *     { "_id": "...", "title": "Python Course", "type": "course", ... }
 *   ]
 * }
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id

    // Step 1: Load user profile
    const user = await User.findById(userId).lean()
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Step 2: Load all resources
    const resources = await Resource.find().lean()
    if (resources.length === 0) {
      return res.json({ resources: [] })
    }

    // Step 3: Load user's interaction history
    const interactions = await Interaction.find({ userId }).lean()

    // Step 4: Build payload for ML service
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

    // Step 5: Call ML microservice for recommendations
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/recommend",
      payload
    )

    const recommendedIds = mlResponse.data.recommended_ids || []

    // Step 6: If no recommendations, return recent resources
    if (!recommendedIds.length) {
      const recent = resources
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return res.json({ resources: recent })
    }

    // Step 7: Order resources by ML rankings
    const orderMap = new Map()
    recommendedIds.forEach((id, index) => orderMap.set(id, index))

    const filtered = resources.filter((r) =>
      orderMap.has(r._id.toString())
    )

    filtered.sort(
      (a, b) =>
        orderMap.get(a._id.toString()) - orderMap.get(b._id.toString())
    )

    // Step 8: Return ordered recommendations
    return res.json({ resources: filtered })
  } catch (err) {
    console.error("Recommendations error:", err.message)
    
    // Fallback: Return recent resources if ML service is down
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