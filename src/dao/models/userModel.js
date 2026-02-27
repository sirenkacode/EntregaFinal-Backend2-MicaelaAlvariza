import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }, // hashed
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: true },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

export const userModel = mongoose.model(userCollection, userSchema);
