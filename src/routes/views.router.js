import { Router } from "express";
import ProductManager from "../ProductManager.js";
const router = Router();
const Manager = new ProductManager("./src/products.json");

router.get("/", async (req, res) => {
  const products = await Manager.getProducts();
  res.render("home", { products, style: "style" });
});
router.get("/real-time-products", async (req, res) => {
  const products = await Manager.getProducts();
  res.render("real_time_products", { products, style: "style" });
});

export default router;
