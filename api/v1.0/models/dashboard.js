var { connectionW, connectionR } = require('../../../connection');

// var connection_write = require('../../../connection_write')

const ListDashboard = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        try {
            // var sqlQuery = selectDb(sql_params);
            var sqlQuery = 'SELECT * FROM dashboard  WHERE 1=1';
            console.log();
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
