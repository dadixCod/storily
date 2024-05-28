const router = require("express").Router();
const productsController = require("../controllers/productsController");

router.route("/").get(productsController.getProducts);

module.exports = router;
