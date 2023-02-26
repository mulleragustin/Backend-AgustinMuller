import { Router, json } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const cartsRouter = Router();

cartsRouter.use(json());

const Cart = new CartManager("src/carts.json");
const Product = new ProductManager("src/productos.json");

cartsRouter.post("/", async (req, res) => {
  await Cart.createCart();
  res.send(await Cart.getCarts());
});

cartsRouter.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);
  const cart = await Cart.getProductsCartById(cid);
  if (!cart) {
    return res
      .status(404)
      .send({ error: `No existe carrito con el id ${cid}` });
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
    return res.status(400).send({ error: "Missing parameters" });
  } else if (!cart) {
    return res
      .status(404)
      .send({ error: `No existe carrito con el id ${cid}` });
  } else if (!product) {
    return res
      .status(404)
      .send({ error: `No existe producto con el id ${pid}` });
  } else {
    await Cart.addToCart(cid, pid, req.body.quantity);
    res.send(await Cart.getProductsCartById(cid));
  }
});

export default cartsRouter;
