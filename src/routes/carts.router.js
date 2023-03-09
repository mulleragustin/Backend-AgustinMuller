import { Router, json } from "express";

import { cartManager, Manager } from "../app.js";
const cartsRouter = Router();

cartsRouter.use(json());

cartsRouter.post("/", async (req, res) => {
  await cartManager.createCart();
  res.send(await cartManager.getCarts()).status(200);
});

cartsRouter.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);
  const cart = await cartManager.getProductsCartById(cid);
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
  const product = await Manager.getProductsById(pid);
  const cart = await cartManager.getProductsCartById(cid);
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
    await cartManager.addToCart(cid, pid, Number(req.body.quantity));
    res.send(await cartManager.getProductsCartById(cid)).status(200);
  }
});

export default cartsRouter;
