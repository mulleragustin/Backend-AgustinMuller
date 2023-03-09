import { Router, json } from "express";

import { Manager } from "../app.js";
const productsRouter = Router();

productsRouter.use(json());

productsRouter.get("/", async (req, res) => {
  const allproducts = await Manager.getProducts();
  const { limit } = req.query;
  if (!limit) {
    return res.send(allproducts).status(200);
  } else {
    const result = allproducts.slice(0, limit);
    return res.send(result).status(200);
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await Manager.getProductsById(pid);
  if (!product) {
    return res
      .status(404)
      .send({ error: `The product with the id ${pid} does not exist. ` });
  } else {
    return res.status(200).send(product);
  }
});

productsRouter.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.code ||
    !req.body.price ||
    !req.body.stock ||
    !req.body.category
  ) {
    return res.status(400).send({ error: "Missing parameters." });
  }
  const products = await Manager.getProducts();
  const codeProducts = products.map((e) => e.code);
  if (codeProducts.includes(req.body.code)) {
    return res
      .status(400)
      .send({ error: "The code already belongs to a product." });
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
  };
  await Manager.addProduct(newProduct);
  res.send(await Manager.getProducts()).status(200);
});

productsRouter.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await Manager.getProductsById(pid);
  if (req.body.id !== product.id) {
    return res.status(400).send({ error: "Cannot modify product id." });
  } else if (!product) {
    return res
      .status(404)
      .send({ error: `The product with the id ${pid} does not exist. ` });
  } else if (
    !req.body.title ||
    !req.body.description ||
    !req.body.code ||
    !req.body.price ||
    !req.body.stock ||
    !req.body.status ||
    !req.body.thumbnails ||
    !req.body.category
  ) {
    return res.status(400).send({ error: "Missing parameters." });
  } else {
    await Manager.updateProduct(pid, req.body);
    console.log(req.body);
    return res.status(200).send(await Manager.getProductsById(pid));
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await Manager.getProductsById(pid);
  if (!product) {
    return res
      .status(404)
      .send({ error: `The product with the id ${pid} does not exist ` });
  }
  await Manager.deleteProduct(pid);
  res.send(await Manager.getProducts()).status(200);
});

export default productsRouter;
