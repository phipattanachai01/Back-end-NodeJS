const { param } = require('express-validator');
var { connectionW, connectionR } = require('../../../connection');

// var connection_write = require('../../../connection_write')

const Proflie = function (param) {
    console.log('🚀 ~ Proflie ~ param:', param);
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        try {
            var use = [param[0].id, 1];
            // console.log('🚀 ~ returnnewPromise ~ use:', use);
            var sqlQuery =
                'SELECT * , sys_role.role_name FROM sys_user INNER JOIN sys_role ON sys_role.role_id=sys_user.user_roleid WHERE sys_user.user_id = $1 AND sys_user.user_status = $2';
            // console.log('🚀 ~ returnnewPromise ~ sqlQuery:', sqlQuery);
            let rows = await client.query(sqlQuery, use);

            // var sqlQuery2 = `SELECT * , sys_role.role_name FROM sys_user INNER JOIN sys_role ON sys_role.role_id=sys_user.user_roleid WHERE sys_user.user_id = ${param[0].id} AND sys_user.user_status = 1`;
            // console.log('🚀 ~ returnnewPromise ~ sqlQuery2:', sqlQuery2);
            // let rows2 = await client.query(sqlQuery2);
            // console.log('🚀 ~ returnnewPromise ~ rows2:', rows2);
            // SELECT sys_user_.* , sys_role.role_name FROM sys_user INNER JOIN sys_role ON sys_role.role_id=sys_user.user_roleid WHERE sys_user.user_id = $1 AND sys_user.user_status = 1
            // SELECT * FROM sys_user WHERE sys_user.user_name = $1 AND sys_user.user_status = 1

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
