const router = require("express").Router();
const {
  getCoupons,
  getOneCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  checkCoupon,
} = require("../controllers/couponController");

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getOneCoupon).put(updateCoupon).delete(deleteCoupon);
router.route("/check-coupon").post(checkCoupon);

module.exports = router;
