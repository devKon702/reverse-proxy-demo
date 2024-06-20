const AuthController = require("../controllers/authController");
const verifyController = require("../controllers/verifyController");

const router = require("express").Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
// router.post("/login", (req, res) => {
//   res.send("<h1>You are login</h1>");
// });
router.get("/logout", verifyController.verifyToken, AuthController.logoutUser);
router.get("/test", (req, res) => {
  res.send("<h1>Hello from Node </h1>");
});

module.exports = router;
