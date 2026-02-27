import CartsDAO from '../dao/mongo/carts.dao.js';
import ProductsDAO from '../dao/mongo/products.dao.js';
import TicketsDAO from '../dao/mongo/tickets.dao.js';

import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';

import { v4 as uuidv4 } from 'uuid';

export default class CartService {
  constructor() {
    this.cartRepo = new CartRepository(new CartsDAO());
    this.productRepo = new ProductRepository(new ProductsDAO());
    this.ticketRepo = new TicketRepository(new TicketsDAO());
  }

  async getById(cid) {
    const cart = await this.cartRepo.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    return cart;
  }

  async create() {
    return this.cartRepo.create({ products: [] });
  }

  async addProduct(cid, pid) {
    const product = await this.productRepo.findById(pid);
    if (!product) throw new Error(`El producto ${pid} no existe!`);

    const cart = await this.cartRepo.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    const idx = cart.products.findIndex((p) => p.product._id?.toString?.() === pid || p.product.toString() === pid);

    // normalize array to store ObjectId values
    const products = cart.products.map((p) => ({
      product: p.product._id ? p.product._id : p.product,
      quantity: p.quantity,
    }));

    if (idx >= 0) products[idx].quantity += 1;
    else products.push({ product: pid, quantity: 1 });

    await this.cartRepo.updateProducts(cid, products);
    return this.getById(cid);
  }

  async removeProduct(cid, pid) {
    const product = await this.productRepo.findById(pid);
    if (!product) throw new Error(`El producto ${pid} no existe!`);

    const cart = await this.cartRepo.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    const products = cart.products
      .filter((p) => (p.product._id ? p.product._id.toString() : p.product.toString()) !== pid)
      .map((p) => ({ product: p.product._id ? p.product._id : p.product, quantity: p.quantity }));

    await this.cartRepo.updateProducts(cid, products);
    return this.getById(cid);
  }

  async updateAll(cid, products) {
    // validate products exist
    for (const item of products) {
      const prod = await this.productRepo.findById(item.product);
      if (!prod) throw new Error(`El producto ${item.product} no existe!`);
    }
    await this.cartRepo.updateProducts(cid, products);
    return this.getById(cid);
  }

  async updateQuantity(cid, pid, quantity) {
    if (!quantity || isNaN(parseInt(quantity))) throw new Error('La cantidad ingresada no es válida!');
    const product = await this.productRepo.findById(pid);
    if (!product) throw new Error(`El producto ${pid} no existe!`);

    const cart = await this.cartRepo.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    const products = cart.products.map((p) => ({
      product: p.product._id ? p.product._id : p.product,
      quantity: p.quantity,
    }));

    const idx = products.findIndex((p) => p.product.toString() === pid);
    if (idx === -1) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);
    products[idx].quantity = parseInt(quantity);

    await this.cartRepo.updateProducts(cid, products);
    return this.getById(cid);
  }

  async clear(cid) {
    await this.cartRepo.updateProducts(cid, []);
    return this.getById(cid);
  }

  /**
   * Compra:
   * - verifica stock
   * - descuenta stock (solo de los items comprados)
   * - genera ticket
   * - deja en el carrito solo los no comprados (por falta de stock)
   */
  async purchase(cid, purchaserEmail) {
    const cart = await this.getById(cid);

    const purchased = [];
    const notPurchased = [];

    let amount = 0;

    for (const item of cart.products) {
      const prod = item.product; // populated
      const qty = item.quantity;

      if (!prod) {
        notPurchased.push({ product: item.product, quantity: qty, reason: 'Producto inexistente' });
        continue;
      }

      if (prod.stock >= qty) {
        // discount stock
        prod.stock -= qty;
        await prod.save();
        purchased.push({ product: prod._id, quantity: qty });
        amount += prod.price * qty;
      } else {
        notPurchased.push({ product: prod._id, quantity: qty, reason: 'Sin stock suficiente' });
      }
    }

    // update cart with remaining
    const remaining = notPurchased.map((i) => ({ product: i.product, quantity: i.quantity }));
    await this.cartRepo.updateProducts(cid, remaining);

    let ticket = null;
    if (purchased.length > 0) {
      ticket = await this.ticketRepo.create({
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount,
        purchaser: purchaserEmail,
      });
    }

    return { ticket, purchased, notPurchased, amount };
  }
}
