import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.static(__dirname + "/../public"));

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
