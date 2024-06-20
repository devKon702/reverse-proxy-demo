const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyController = require("../controllers/verifyController");

// router.get("/", verifyController.verifyToken, userController.getAllUser);
// router.get(
//   "/:id",
//   verifyController.verifyCheckUserInfor,
//   userController.getUserById
// );

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);

module.exports = router;
