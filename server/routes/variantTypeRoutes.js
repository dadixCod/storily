const router = require("express").Router();
const {
  getVariantTypes,
  getOneVariantType,
  addVariantType,
  updateVariantType,
  deleteVariantType,
} = require("../controllers/vraiantTypeController");

router.route("/").get(getVariantTypes).post(addVariantType);

router
  .route("/:id")
  .get(getOneVariantType)
  .put(updateVariantType)
  .delete(deleteVariantType);

module.exports = router;
