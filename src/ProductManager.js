import fs from "fs";
import crypto from "crypto";

class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async generateId() {
    const products = await this.getProducts();
    const ids = products.map((e) => e.id);
    let id;
    do {
      id = crypto.randomInt(1, 1000000000000);
    } while (ids.includes(id));

    return id;
  }
  async addProduct({ title, description, code, price, stock, category }) {
    try {
      const newProduct = {
        id: await this.generateId(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: [],
      };

      const products = await this.getProducts();

      const updateProducts = [...products, newProduct];

      await fs.promises.writeFile(this.path, JSON.stringify(updateProducts));
    } catch (e) {
      console.log(e);
    }
  }
  async readFile() {
    const products = await fs.promises.readFile(this.path, "utf-8");
    return products;
  }
  async getProducts() {
    try {
      const products = await this.readFile();
      return JSON.parse(products);
    } catch (e) {
      return [];
    }
  }
  async getProductsById(id) {
    try {
      const products = await this.getProducts();
      let result = await products.find((element) => element.id === id);
      if (!result) {
        throw new Error("Not Found");
      } else {
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateProduct(id, body) {
    try {
      let allProducts = await this.getProducts();
      allProducts = allProducts.map((p) => {
        if (id === p.id) {
          return {
            id: p.id,
            ...body,
          };
        }
        return p;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(allProducts));
    } catch (e) {
      console.log(e);
    }
  }
  async deleteProduct(id) {
    try {
      const allProducts = await this.getProducts();
      const deleteProduct = await this.getProductsById(id);
      const index = await allProducts.findIndex(
        (p) => p.id === deleteProduct.id
      );
      allProducts.splice(index, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(allProducts));
    } catch (e) {
      console.log(e);
    }
  }
}

export default ProductManager;
