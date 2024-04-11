const { connection } = require('../../../connection');

const file = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuerydetail = `SELECT * FROM`
            let sqlQuery = `INSERT INTO ticket_file (file_name, file_size, file_type, file_extension, file_detailid, file_createdate, file_url, file_path)
            VALUES ($1, $2, $3, $4, 0, $5, $6, $7, $8)`;
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

