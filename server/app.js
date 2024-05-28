const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productsRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");

const app = express();

app.use(express.json());
app.use(cors());

//static foder path
app.use("images/category", express.static("public/category"));
app.use("images/products", express.static("public/products"));
app.use("images/posters", express.static("public/posters"));

//Routes
app.use("/products", productsRouter);
app.use("/categories", categoryRouter);

module.exports = app;
