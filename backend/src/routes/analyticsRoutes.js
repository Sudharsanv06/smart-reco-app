const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const { getUserAnalytics } = require("../controllers/analyticsController")

router.get("/user", authMiddleware, getUserAnalytics)

module.exports = router
