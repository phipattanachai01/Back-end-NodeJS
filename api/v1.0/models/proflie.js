var { connectionW, connectionR } = require('../../../connection');

// var connection_write = require('../../../connection_write')

const Proflie = function (param) {
    // console.log('🚀 ~ Proflie ~ param:', param);
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        try {
            var use = [param[0].id];
            console.log('🚀 ~ returnnewPromise ~ use:', use);
            var sqlQuery =
                'SELECT * , sys_role.role_name FROM sys_user INNER JOIN sys_role ON sys_role.role_id=sys_user.user_roleid WHERE sys_user.user_id = $1 AND sys_user.user_status = 1 AND sys_user.user_delete = 0';
            // console.log('🚀 ~ returnnewPromise ~ sqlQuery:', sqlQuery);
            let rows = await client.query(sqlQuery, use);

           

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
