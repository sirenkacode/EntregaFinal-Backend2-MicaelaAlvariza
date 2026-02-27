import { userModel } from '../models/userModel.js';

export default class UsersDAO {
  async findByEmail(email) {
    return userModel.findOne({ email });
  }

  async findById(id) {
    return userModel.findById(id);
  }

  async create(data) {
    return userModel.create(data);
  }

  async updatePasswordById(id, newHashedPassword) {
    return userModel.updateOne({ _id: id }, { password: newHashedPassword });
  }
}
