import { Router, json } from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = Router();

productsRouter.use(json());

const Manager = new ProductManager("./src/data.json");

productsRouter.get("/", async (req, res) => {
  const allproducts = await Manager.getProducts();
  const { limit } = req.query;
  if (!limit) {
    return res.send(allproducts);
  } else {
    const resultado = allproducts.slice(0, limit);
    return res.send(resultado);
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
    return res.send(product);
  }
});

productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
  } = req.body;
  if(!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.stock || !req.body.category) {return res.status(400).send({error : "Missing parameters"})}
  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
  };
  await Manager.addProduct(newProduct);
  res.send(await Manager.getProducts());
});

productsRouter.put("/",async (req,res) => {

})

export default productsRouter;
