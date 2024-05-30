const router = require("express").Router();
const {
  getUsers,
  getOneUser,
  loginUser,
  signUpUser,
  updateUser,
  updatePassword,
  deleteUser,
} = require("../controllers/userController");

router.route("/").get(getUsers);
router.route("/login").post(loginUser);
router.route("/signup").post(signUpUser);
router.route("/:id").get(getOneUser).put(updateUser).delete(deleteUser);
router.route("/password/:id").put(updatePassword);

module.exports = router;
