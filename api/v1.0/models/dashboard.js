var { connectionW, connectionR } = require('../../../connection');

// var connection_write = require('../../../connection_write')

const ListDashboard = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        try {
            var sqlQuery = `SELECT 'sys_company' AS table_name, COUNT(company_id) AS count_result
            FROM sys_company
            UNION ALL
            SELECT 'sys_user_status_1' AS table_name, COUNT(user_id) AS count_result
            FROM sys_user WHERE user_status = 1
            UNION ALL
            SELECT 'sys_user_status_0' AS table_name, COUNT(user_id) AS count_result
            FROM sys_user WHERE user_status = 0
            UNION ALL
            SELECT 'sys_company_contact' AS table_name, COUNT(contact_id) AS count_result
            FROM sys_company_contact`;
            let rows = await client.query(sqlQuery);
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
    ListDashboard,
};
