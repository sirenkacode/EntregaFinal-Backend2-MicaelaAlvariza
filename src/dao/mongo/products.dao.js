import productModel from '../models/productModel.js';

export default class ProductsDAO {
  async paginate(filter = {}, options = {}) {
    return productModel.paginate(filter, options);
  }

  async findById(id) {
    return productModel.findById(id);
  }

  async create(data) {
    return productModel.create(data);
  }

  async updateById(id, data) {
    return productModel.updateOne({ _id: id }, data);
  }

  async deleteById(id) {
    return productModel.deleteOne({ _id: id });
  }
}
