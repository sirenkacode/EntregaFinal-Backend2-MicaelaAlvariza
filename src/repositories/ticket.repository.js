export default class TicketRepository {
  constructor(dao) { this.dao = dao; }
  create(data) { return this.dao.create(data); }
}
