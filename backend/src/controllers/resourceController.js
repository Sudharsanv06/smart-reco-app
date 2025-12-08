const Resource = require("../models/Resource")

exports.getResources = async (req, res) => {
  try {
    const { limit } = req.query
    const query = Resource.find().sort({ createdAt: -1 })

    if (limit) {
      query.limit(Number(limit))
    }

    const resources = await query.exec()
    return res.json({ resources })
  } catch (err) {
    console.error("Get resources error:", err)
    return res.status(500).json({ message: "Failed to fetch resources" })
  }
}

exports.createResource = async (req, res) => {
  try {
    const { title, type, url, tags, difficulty, rating } = req.body

    if (!title || !url) {
      return res
        .status(400)
        .json({ message: "Title and URL are required" })
    }

    const resource = await Resource.create({
      title,
      type,
      url,
      tags,
      difficulty,
      rating,
    })

    return res.status(201).json({ resource })
  } catch (err) {
    console.error("Create resource error:", err)
    return res.status(500).json({ message: "Failed to create resource" })
  }
}
