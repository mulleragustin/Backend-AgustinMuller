import express from "express";
import ProductManager from "./ProductManager.js";
import productsRouter from "./routes/products.router.js";
const app = express();

app.use("/api/products", productsRouter)

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
