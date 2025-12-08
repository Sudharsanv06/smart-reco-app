const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const {
  addInteraction,
  getUserInteractions,
} = require("../controllers/interactionController")

router.post("/", authMiddleware, addInteraction)
router.get("/user", authMiddleware, getUserInteractions)

module.exports = router
