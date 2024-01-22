import { CartManager, ProductManager } from "../DAO/factory.js";
import CartRepository from "./services/carts.repository.js";
import ProductRepository from "./services/carts.repository.js";

export const cartService = new CartRepository(new CartManager())
export const productService = new ProductRepository(new ProductManager())