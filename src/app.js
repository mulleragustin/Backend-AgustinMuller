import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const Producto = new ProductManager("./data.json");
const allproducts = await Producto.getProducts();
//
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/products", async (req, res) => {
  const { limit } = req.query;
  if (!limit) {
    return res.send(allproducts);
  } else {
    const resultado = allproducts.slice(0, limit);
    return res.send(resultado);
  }
});
app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await Producto.getProductsById(Number(pid));
  if (!product) {
    return res
      .status(404)
      .send({ error: `No existe producto con el id ${pid}` });
  } else {
    return res.send(product);
  }
});
app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
