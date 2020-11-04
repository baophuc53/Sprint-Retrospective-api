const db = require("../utils/db");
const md5 = require("md5");

module.exports = {
  load: async (userName) => {
    const row = await db.load(`SELECT * FROM user WHERE username = ?`, userName);
    return row[0];
  },
  add: (entity) => db.insert("user", entity),
  update: entity => {
    const condition = { id: entity.id };
    delete entity.id;
    return db.update('user', entity, condition);
  },
  delete: (id) => db.delete("user", { id }),
};
