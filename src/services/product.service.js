import ProductsDAO from '../dao/mongo/products.dao.js';
import ProductRepository from '../repositories/product.repository.js';

export default class ProductService {
  constructor() {
    const dao = new ProductsDAO();
    this.repo = new ProductRepository(dao);
  }

  async getAll(params) {
    const options = {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 10,
      lean: true,
    };
    if (params.sort && (params.sort === 'asc' || params.sort === 'desc')) {
      options.sort = { price: params.sort };
    }

    const products = await this.repo.paginate({}, options);

    // Links (kept similar to your original)
    const base = 'http://localhost:8080/products';
    products.prevLink = products.hasPrevPage ? `${base}?page=${products.prevPage}` : null;
    products.nextLink = products.hasNextPage ? `${base}?page=${products.nextPage}` : null;
    if (products.prevLink && options.limit !== 10) products.prevLink += `&limit=${options.limit}`;
    if (products.nextLink && options.limit !== 10) products.nextLink += `&limit=${options.limit}`;
    if (products.prevLink && options.sort) products.prevLink += `&sort=${params.sort}`;
    if (products.nextLink && options.sort) products.nextLink += `&sort=${params.sort}`;

    return products;
  }

  async getById(pid) {
    const product = await this.repo.findById(pid);
    if (!product) throw new Error(`El producto ${pid} no existe!`);
    return product;
  }

  async create(data) {
    const { title, description, code, price, stock, category, thumbnails, owner } = data;
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error('Error al crear el producto');
    }
    return this.repo.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || [],
      owner: owner || 'admin',
    });
  }

  async update(pid, update) {
    return this.repo.updateById(pid, update);
  }

  async delete(pid) {
    const result = await this.repo.deleteById(pid);
    if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);
    return result;
  }
}
