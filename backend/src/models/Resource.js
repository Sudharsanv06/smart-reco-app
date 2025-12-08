const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "blog", "course", "problem-set"],
      default: "video",
    },
    url: { type: String, required: true },
    tags: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Resource", resourceSchema)
