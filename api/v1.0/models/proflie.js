const { param } = require('express-validator');
var { connectionW, connectionR } = require('../../../connection');

// var connection_write = require('../../../connection_write')

const Proflie = function (param) {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        try {
            var sqlQuery = "SELECT sys_user.*, sys_role.role_name FROM sys_user JOIN sys_role ON sys_user.user_id = sys_role.role_name WHERE sys_user.user_name = $1 AND sys_user.user_status = 1";
            let rows = await client.query(sqlQuery, param);
            if (rows.rows) {
                resolve(rows.rows);
            }
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

module.exports = {
    Proflie,
};
