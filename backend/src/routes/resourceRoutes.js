const express = require("express")
const router = express.Router()
const {
  getResources,
  createResource,
} = require("../controllers/resourceController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", getResources)
router.post("/", authMiddleware, createResource)

module.exports = router
