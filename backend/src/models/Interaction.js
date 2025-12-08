const mongoose = require("mongoose")

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    action: {
      type: String,
      enum: ["view", "save", "like"],
      required: true,
    },
  },
  { timestamps: true }
)

interactionSchema.index({ userId: 1, resourceId: 1, action: 1 }, { unique: true })

module.exports = mongoose.model("Interaction", interactionSchema)
