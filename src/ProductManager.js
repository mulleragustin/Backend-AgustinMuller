import fs from "fs";

class ProductManager {
  #accumulator = 1;
  constructor(path) {
    this.path = path;
  }
  async addProduct({title, description, price, thumbnail, code, stock}) {
    const newProduct = {
      id: this.#accumulator,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const products = await this.getProducts();

    const updateProducts = [...products, newProduct];

    await fs.promises.writeFile(this.path, JSON.stringify(updateProducts));

    this.#accumulator++;
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
      let resultado = await products.find((element) => element.id === id);
      if (!resultado) {
        throw new Error("Not Found");
      } else {
        return resultado;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateProduct(id, changeProperty, newValue) {
    try {
      if (changeProperty === "id") {
        throw Error("No se puede modificar el id");
      }
      const allproducts = await this.getProducts();
      const productUpdate = await this.getProductsById(id);
      const index = await allproducts.findIndex(
        (p) => p.id === productUpdate.id
      );
      allproducts[index][changeProperty] = newValue;
      await fs.promises.writeFile(this.path, JSON.stringify(allproducts));
    } catch (e) {
      console.log(e);
    }
  }
  async deleteProduct(id) {
    try {
      const allproducts = await this.getProducts();
      const deleteProduct = await this.getProductsById(id);
      const index = await allproducts.findIndex(
        (p) => p.id === deleteProduct.id
      );
      allproducts.splice(index, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(allproducts, JSON.stringify(allproducts))
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export default ProductManager;
