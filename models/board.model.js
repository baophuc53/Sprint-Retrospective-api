const db = require("../utils/db");

module.exports = {
    loadAllByUser: (userId) => db.load(`SELECT id, name FROM board WHERE owner = ?`, userId),
    addByUser: (userId, name) => db.insert("board", {name, owner: userId})
}