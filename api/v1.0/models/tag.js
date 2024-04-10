var { connection } = require('../../../connection');

const createTag = async function (data) {
    return new Promise(async(resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `INSERT INTO set_tag (tag_name, tag_color, tag_delete, tag_createdate) VALUES ($1, $2, 0, $3) RETURNING tag_id`;
            let rows = await client.query(sqlQuery, data);
            resolve(rows.rows[0].tag_id);
        } catch (error) {
            reject(error);
          } finally {
            client.release();
        }
    })
};

const listTag = async function () {
    return new Promise(async(resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM set_tag WHERE tag_delete = 0`;
            let rows = await client.query(sqlQuery);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
          } finally {
            client.release();
        }
    })
}

const deleteTag = async function (tagId) {
    return new Promise(async(resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `UPDATE set_tag SET tag_delete = 1 WHERE tag_id = $1`;
            let rows = await client.query(sqlQuery, tagId);
            // console.log("🚀 ~ returnnewPromise ~ rows:", rows)
            resolve(rows);


        } catch (error) {
            reject(error);
          } finally {
            client.release();
        }
    })
}

module.exports = { createTag,
    deleteTag,
    listTag 
};