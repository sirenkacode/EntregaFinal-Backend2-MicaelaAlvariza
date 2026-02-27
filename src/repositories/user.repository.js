export default class UserRepository {
  constructor(dao) { this.dao = dao; }
  findByEmail(email) { return this.dao.findByEmail(email); }
  findById(id) { return this.dao.findById(id); }
  create(data) { return this.dao.create(data); }
  updatePasswordById(id, hashed) { return this.dao.updatePasswordById(id, hashed); }
}
