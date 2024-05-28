const router = require("express").Router();
const {
  getCategories,
  addCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.route("/").get(getCategories).post(addCategory);

router
  .route("/:id")
  .get(getOneCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
