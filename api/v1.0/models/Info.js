var { connectionW, connectionR } = require('../../../connection');
var { selectDb, insertDb, updateDb } = require('./helperQuery');

var { DB_SCHEMA_1, DB_SCHEMA_2, DB_SCHEMA_3 } = require('../../../config/default');
let { dateTimeFormater } = require('../middleware/formatConverter');

// var connection_write = require('../../../connection_write')

const list = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        let datetimeNow = dateTimeFormater(new Date(), 'yyyy-MM-dd HH:mm:ss');
        try {
            var sql_params = {
                table_name: 'package',
                columns: ['*'],
                where: [],
                join: [],
                otherSql: ``,
                group_by: [],
            };

            // var sqlQuery = selectDb(sql_params);
            var sqlQuery = 'SELECT * FROM package  WHERE 1=1  ';
            console.log()
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

const bankCreate = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        let datetimeNow = dateTimeFormater(new Date(), 'yyyy-MM-dd HH:mm:ss');
        try {
            await client.query('BEGIN');
            var insert_params = {
                table_name: `${DB_SCHEMA_3}.sys_bank`,
                insertData: params.valueCerate,
                returns: ['bank_id', 'bank_code', 'bank_name', 'bank_short_name', 'bank_status'],
            };

            var sqlQuery = insertDb(insert_params);
            console.log('🚀 ~ file: Bank.js:58 ~ returnnewPromise ~ sqlQuery:', sqlQuery);
            let rows = await client.query(sqlQuery);

            await client.query('COMMIT');

            if (rows.rows) {
                resolve(rows.rows);
            }
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};
module.exports = {
    list,
};
