const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoute = require("./routes/products/product.route");
const categoryRoute = require("./routes/category/category.route");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.get("/", async (req, res, next) => {
  try {
    res.send({ message: "Awesome it works 🐻" });
  } catch (error) {
    next(error);
  }
});

app.use("/products", productRoute);
app.use("/category", categoryRoute);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
