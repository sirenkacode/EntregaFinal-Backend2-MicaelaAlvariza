import { userModel } from './models/userModel.js';
import { cartModel } from './models/cartModel.js';
import { createHash } from '../utils/bcryptUtil.js';

class userDBManager {
  async getAllUsers() {
    return userModel.find().lean();
  }

  async getUserById(uid) {
    const user = await userModel.findById(uid).lean();
    if (!user) throw new Error(`El usuario ${uid} no existe!`);
    return user;
  }

  async getUserByEmail(email) {
    return userModel.findOne({ email });
  }

  async createUser(payload) {
    const { first_name, last_name, email, age, password, cart, role } = payload;
    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error('Error al crear el usuario: faltan campos requeridos');
    }

    const exists = await userModel.findOne({ email });
    if (exists) throw new Error('Ya existe un usuario con ese email');

    const hashed = createHash(password);
    const userCart = cart ? cart : (await cartModel.create({ products: [] }))._id;
    return userModel.create({ first_name, last_name, email, age, password: hashed, cart: userCart, role });
  }

  async updateUser(uid, update) {
    const toUpdate = { ...update };
    if (toUpdate.password) {
      toUpdate.password = createHash(toUpdate.password);
    }

    const result = await userModel.updateOne({ _id: uid }, toUpdate);
    if (result.matchedCount === 0) throw new Error(`El usuario ${uid} no existe!`);
    return result;
  }

  async deleteUser(uid) {
    const result = await userModel.deleteOne({ _id: uid });
    if (result.deletedCount === 0) throw new Error(`El usuario ${uid} no existe!`);
    return result;
  }
}

export { userDBManager };
