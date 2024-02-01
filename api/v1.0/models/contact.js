var {connection} = require('../../../connection')

const Contact = function ( ) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = 'SELECT * FROM sys_contact';
            console.log();
            let rows = await client.query(sqlQuery);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
}

module.exports = { Contact };