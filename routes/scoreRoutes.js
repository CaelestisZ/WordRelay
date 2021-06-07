const express = require("express");
const scoreController = require("./../controllers/scoreController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/:id").get(scoreController.getScoresForUser);

router.route("/").get(scoreController.getLeaderboard);

router.route("/updateUser").post(scoreController.updateUser);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
