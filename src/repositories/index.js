import { CartManager, ProductManager, ChatManager, UserManager, TicketManager } from "../DAO/factory.js";
import CartRepository from "./services/carts.repository.js";
import ProductRepository from "./services/products.repository.js";
import ChatRepository from "./services/chat.repository.js";
import UserRepository from "./services/user.repository.js";
import TicketRepository from "./services/ticket.repository.js";

export const cartService = new CartRepository(new CartManager())
export const productService = new ProductRepository(new ProductManager())
export const chatService = new ChatRepository(new ChatManager())
export const userService = new UserRepository(new UserManager())
export const ticketService = new TicketRepository(new TicketManager()) 