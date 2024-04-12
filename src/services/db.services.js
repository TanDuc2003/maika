const { db } = require("../config/connect.arango.db");

class DBServices {
  constructor() {
    this.db = db;
  }

  async createData(dataPost) {
    try {
      const collection = this.db.collection("vexere");
      // const ticket = {
      //   ...dataPost,
      //   _key: ticket_id,
      // };
      await collection.save(dataPost);
    } catch (error) {
      console.error("createData error", error);
    }
  }
}

module.exports = DBServices;
