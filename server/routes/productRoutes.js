const router = require("express").Router();
const {
  getProducts,
  getOneProduct,
  addProduct,
  updateProuct,
  deleteProduct,
} = require("../controllers/productsController");

router.route("/").get(getProducts).post(addProduct);
router.route("/:id").get(getOneProduct).put(updateProuct).delete(deleteProduct);

module.exports = router;
