const router = require("express").Router();
const {
  getOrders,
  getOneOrder,
  getUserOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/").get(getOrders).post(addOrder);
router.route("/:id").get(getOneOrder).put(updateOrder).delete(deleteOrder);
router.route("/userOrders/:userId").get(getUserOrders);

module.exports = router;
