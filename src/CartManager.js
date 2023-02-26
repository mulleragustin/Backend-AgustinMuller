import fs from "fs";
import crypto from "crypto";

class CartManager {
  constructor(path) {
    this.path = path;
  }
  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      return [];
    }
  }
  async generateId() {
    const carts = await this.getCarts();
    const ids = carts.map((e) => e.id);
    let id;
    do {
      id = crypto.randomInt(1, 10000000000);
    } while (ids.includes(id));

    return id;
  }
  async createCart() {
    try {
      const newCart = {
        id: await this.generateId(),
        products: [],
      };
      let allCarts = await this.getCarts();
      const asd = [...allCarts, newCart];
      await fs.promises.writeFile(this.path, JSON.stringify(asd));
    } catch (e) {
      console.log(e);
    }
  }
  async getProductsCartById(id) {
    try {
      const allCarts = await this.getCarts();
      const cart = allCarts.find((cart) => cart.id === id);
      if (!cart) {
        throw new Error("Not Found");
      } else {
        return cart.products;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async addToCart(cid, pid, quant) {
    try {
      let allCarts = await this.getCarts();
      const cartIndex = await allCarts.findIndex((cart) => cart.id === cid);
      const product = await this.getProductsCartById(cid);
      const pIndex = product.findIndex((p) => p.id === pid);
      if (pIndex !== -1) {
        allCarts[cartIndex].products[pIndex].quantity += quant;
      } else {
        const newProduct = {
          id: pid,
          quantity: quant,
        };
        allCarts[cartIndex].products.push(newProduct);
      }
      await fs.promises.writeFile(this.path, JSON.stringify(allCarts));
    } catch (e) {
      console.log(e);
    }
  }
}

export default CartManager;
