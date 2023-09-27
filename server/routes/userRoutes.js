const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/signup").post(registerUser);
router.post("/login", authUser);
router.get("/allusers", protect, allUsers);

module.exports = router;
