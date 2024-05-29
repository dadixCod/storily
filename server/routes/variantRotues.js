const router = require("express").Router();
const {
  getVariants,
  getOneVariant,
  addVariant,
  updateVariant,
  deleteVariant,
} = require("../controllers/variantController");

router.route("/").get(getVariants).post(addVariant);

router
  .route("/:id")
  .get(getOneVariant)
  .put(updateVariant)
  .delete(deleteVariant);

module.exports = router;
