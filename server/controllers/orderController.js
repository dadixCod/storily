const Order = require("../models/Order");

//Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("couponCode", "id couponCode discountType discountAmount")
      .populate("userID", "id name email")
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get Orders by userID
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userID: userId })
      .populate("couponCode", "id couponCode discountType discountAmount")
      .populate("userID", "id name email")
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get orders by ID
exports.getOneOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await Order.findById(orderId)
      .populate("couponCode", "id couponCode discountType discountAmount")
      .populate("userID", "id name email")
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Create new order
exports.addOrder = async (req, res) => {
  const {
    userID,
    orderStatus,
    items,
    totalPrice,
    shippingAddress,
    paymentMethod,
    couponCode,
    orderTotal,
    trackingUrl,
  } = req.body;

  if (
    !userID ||
    !items ||
    !totalPrice ||
    !shippingAddress ||
    !paymentMethod ||
    !orderTotal
  ) {
    return res.status(400).json({
      success: false,
      message:
        "User ID, items, totalPrice, shippingAddress, paymentMethod, and orderTotal are required.",
    });
  }
  try {
    const order = new Order({
      userID,
      orderStatus,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      couponCode,
      orderTotal,
      trackingUrl,
    });
    const newOrder = await order.save();
    res.status(200).json({
      success: true,
      message: "Order created successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update an order == updating status or tracking URL

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus, trackingUrl } = req.body;
    if (!orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Order Status required." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus,
        trackingUrl,
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.json({
      success: true,
      message: "Order updated successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const orderID = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderID);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

