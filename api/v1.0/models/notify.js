var {connection} = require('../../../connection')

const MainNOtification = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM sys_notification ORDER BY sys_notification`;
            let rows = await client.query(sqlQuery);
            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        }
    })
};
module.exports = { MainNOtification }