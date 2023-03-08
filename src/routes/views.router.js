import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const Manager = new ProductManager("./src/products.json");

router.get("/products", async (req, res) => {
  const products = await Manager.getProducts();
  res.render("products", { products });
});

export default router;
