const router = require("express").Router();
const {
  getBrands,
  getOneBrand,
  addBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

router.route("/").get(getBrands).post(addBrand);
router.route("/:id").get(getOneBrand).put(updateBrand).delete(deleteBrand);

module.exports = router;
