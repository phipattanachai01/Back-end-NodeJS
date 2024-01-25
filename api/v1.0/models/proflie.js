const { param } = require('express-validator');
var { connectionW, connectionR } = require('../../../connection');

// var connection_write = require('../../../connection_write')

const Proflie = function (param) {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        try {
            var sqlQuery = "SELECT * FROM sys_user WHERE user_firstname = $1";

            console.log();
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
