import ProductManager from "./ProductManager.js";
import fs from "fs";
import crypto from "crypto";
class CartManager {
  constructor(path) {
    this.path = path;
    this.products = new ProductManager("./productos.json");
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
      const product = await this.getProductsCartById(cid)
      //const checkp = product.find( p => p.id === pid)
      
      /* if (checkp) {
        allCarts[cartIndex].quantity += quant;
        
      } else { */
        const newProduct = {
          id: pid,
          quantity: quant,
        };
        const productsactualizacion = [...product,newProduct]
        allCarts[cartIndex].products = productsactualizacion
        /* allCarts = await allCarts.map((c) => {
          if (cid === c.id) {
            return {
              id: c.id,
              products: [...newProduct],
            };
          }
        }); */
    
    await fs.promises.writeFile(this.path,JSON.stringify(allCarts)) 
    } catch (e) {
      console.log(e);
    }
  }
}

export default CartManager;
/* 
Para el carrito, el cual tendrá su router en /api/carts/, configurar dos rutas:
La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
id: Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
La ruta POST /:cid/product/:pid deberá agregar el producto al arreglo products del carrito seleccionado, como un objeto bajo el siguiente formato:
product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.
La persistencia de la información se implementará utilizando el file system, donde los archivos products.json y carts.json, respaldan la información.
No es necesario realizar ninguna implementación visual. Todo el flujo se puede realizar por Postman o por el cliente de tu preferencia.
 */
