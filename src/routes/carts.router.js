import { Router, json } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const cartsRouter = Router();

cartsRouter.use(json());

const Cart = new CartManager("src/carts.json");
const Product = new ProductManager("src/products.json");

cartsRouter.post("/", async (req, res) => {
  await Cart.createCart();
  res.send(await Cart.getCarts()).status(200);
});

cartsRouter.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);
  const cart = await Cart.getProductsCartById(cid);
  if (!cart) {
    return res
      .status(404)
      .send({ error: `The cart with the id ${cid} does not exist. ` });
  } else {
    return res.status(200).send(cart);
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const product = await Product.getProductsById(pid);
  const cart = await Cart.getProductsCartById(cid);
  if (!req.body.quantity) {
    return res.status(400).send({ error: "Missing parameters." });
  } else if (!cart) {
    return res
      .status(404)
      .send({ error: `The cart with the id ${cid} does not exist. ` });
  } else if (!product) {
    return res
      .status(404)
      .send({ error: `The product with the id ${pid} does not exist. ` });
  } else {
    await Cart.addToCart(cid, pid, Number(req.body.quantity));
    res.send(await Cart.getProductsCartById(cid)).status(200);
  }
});

export default cartsRouter;
