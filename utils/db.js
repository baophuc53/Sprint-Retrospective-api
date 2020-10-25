const mysql = require("mysql2");
const util = require("util");
const config = require("../config/config.json");

const pool = mysql.createPool(config.mysql);
const query = util.promisify(pool.query).bind(pool);

module.exports = {
    load: query,
    insert: (tableName, entity) => query(`INSERT INTO ${tableName} SET ? `, entity),
    delete: (tableName, condition) => query(`DELETE FROM ${tableName} WHERE ?`, condition),
    update: (tableName, entity, condition) => query(`UPDATE ${tableName} SET ? WHERE ?`, [entity, condition])
}