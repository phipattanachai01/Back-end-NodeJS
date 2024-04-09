const { connection } = require('../../../connection');

const file = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `INSERT INTO ticket_file (ticket_file_name, ticket_file_size, ticket_file_type, ticket_file_extension, ticket_file_detailid, ticket_file_createdate)
            VALUES ($1, $2, $3, $4, 0, $5, $6)`;
            let rows = await client.query(sqlQuery);
            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

module.exports = {
    file
};

