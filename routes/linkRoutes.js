const express = require("express");
const router = express.Router();
const controller = require("../controllers/linkController");

// API
router.post("/shorten", controller.createShortUrl);

// Redirection
router.get("/:code", controller.redirect);

module.exports = router;