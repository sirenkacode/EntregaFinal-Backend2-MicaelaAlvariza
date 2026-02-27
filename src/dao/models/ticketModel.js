import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }, // email
  },
  { timestamps: true }
);

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
