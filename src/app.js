import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const Manager = new ProductManager(__dirname + "/products.json");
const cartManager = new CartManager(__dirname + "/carts.json");

const app = express();

app.use(express.static(__dirname + "/../public"));

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("New client connected");
  const products = await Manager.getProducts();
  socket.emit("products", products);
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

export { Manager, cartManager };
