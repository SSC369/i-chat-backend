const router = require("express").Router();

const {
  register,
  login,
  setAvatar,
  getAllUsers,
  logOut,
  getChatUser,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);
router.get("/getChatUser/:id", getChatUser);
module.exports = router;
