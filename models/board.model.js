const db = require("../utils/db");

module.exports = {
  loadAllByUser: (userId) =>
    db.load(`SELECT id, name FROM board WHERE owner = ?`, userId),
  addByUser: (userId, name) => db.insert("board", { name, owner: userId }),
  edit: (userId, id, name) => {
    const condition = { id };
    return db.update("board", { name, owner: userId }, condition);
  },
  delete: (id) => db.delete("board", { id }),
};
