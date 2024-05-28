const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to DB successfully");
});

const port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});
