export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  paginate(filter, options) { return this.dao.paginate(filter, options); }
  findById(id) { return this.dao.findById(id); }
  create(data) { return this.dao.create(data); }
  updateById(id, data) { return this.dao.updateById(id, data); }
  deleteById(id) { return this.dao.deleteById(id); }
}
