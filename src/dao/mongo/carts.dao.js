import { cartModel } from '../models/cartModel.js';

export default class CartsDAO {
  async findById(id) {
    return cartModel.findById(id).populate('products.product');
  }

  async create(data = { products: [] }) {
    return cartModel.create(data);
  }

  async updateProducts(id, products) {
    return cartModel.updateOne({ _id: id }, { products });
  }
}
