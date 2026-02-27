import { ticketModel } from '../models/ticketModel.js';

export default class TicketsDAO {
  async create(data) {
    return ticketModel.create(data);
  }
}
