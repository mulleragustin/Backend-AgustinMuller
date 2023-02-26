import { Router, json } from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = Router();

productsRouter.use(json());

const Manager = new ProductManager("./src/products.json");

productsRouter.get("/", async (req, res) => {
  const allproducts = await Manager.getProducts();
  const { limit } = req.query;
  if (!limit) {
    return res.send(allproducts).status(200);
  } else {
    const resultado = allproducts.slice(0, limit);
    return res.send(resultado).status(200);
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await Manager.getProductsById(pid);
  if (!product) {
    return res
      .status(404)
      .send({ error: `No existe producto con el id ${pid}` });
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
    return res.status(400).send({ error: "Missing parameters" });
  }
  const products = await Manager.getProducts();
  const codeProducts = products.map((e) => e.code);
  if (codeProducts.includes(req.body.code)) {
    return res
      .status(400)
      .send({ error: "el codigo ya pertence a un producto" });
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
    return res
      .status(400)
      .send({ error: "No se puede modificar el id del producto" });
  } else if (!product) {
    return res
      .status(404)
      .send({ error: `No existe producto con el id ${pid}` });
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
    return res.status(400).send({ error: "Missing parameters" });
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
      .send({ error: `No existe producto con el id ${pid}` });
  }
  await Manager.deleteProduct(pid);
  res.send(await Manager.getProducts()).status(200);
});

export default productsRouter;
