export default class CartRepository {
  constructor(dao) { this.dao = dao; }
  findById(id) { return this.dao.findById(id); }
  create(data) { return this.dao.create(data); }
  updateProducts(id, products) { return this.dao.updateProducts(id, products); }
}
