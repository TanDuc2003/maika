const { db } = require("../config/connect.arango.db");

class DBServices {
  constructor() {
    this.db = db;
  }

  async createData(dataPost, ticket_id) {
    try {
      const collection = this.db.collection("vexere");
      const ticket = {
        ...dataPost,
        _key: ticket_id,
      };
      await collection.save(ticket);
    } catch (error) {
      console.error("createData error", error);
    }
  }
}

module.exports = DBServices;
