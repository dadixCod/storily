const router = require("express").Router();
const {
  getSubCategories,
  getOneSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");

router.route("/").get(getSubCategories).post(addSubCategory);
router
  .route("/:id")
  .get(getOneSubCategory)
  .put(updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
