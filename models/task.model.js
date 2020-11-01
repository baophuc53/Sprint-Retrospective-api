const db = require("../utils/db");

module.exports = {
    loadAllByBoard: (boardId) => db.load(`SELECT id, name, column_name FROM board_task WHERE board_id = ?`, boardId),
    add: (board_id, name, column_name) => db.insert("board_task", {board_id, name, column_name}),
    update: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        return db.update('board_task', entity, condition);
      },
    delete: id => db.delete("board_task", {id}),
}