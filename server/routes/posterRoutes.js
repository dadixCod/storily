const router = require("express").Router();
const {
  getPosters,
  getOnePoster,
  addPoster,
  updatePoster,
  deletePoster,
} = require("../controllers/posterController");

router.route("/").get(getPosters).post(addPoster);
router.route("/:id").get(getOnePoster).put(updatePoster).delete(deletePoster);

module.exports = router;
