var { v5: uuidv5 } = require('uuid');
var { connectionW, connectionR } = require('../../../connection');
var { selectDb, insertDb } = require('./helperQuery');
var {
    JWT_SECRET,
    TOKEN_LIFE,
    REFRESH_TOKEN_LIFE,
    REFRESH_TOKEN_SECRET,
    DB_SCHEMA,
    DB_SCHEMA_LOG_APP,
} = require('../../../config/default');
let { dateTimeFormater } = require('../middleware/formatConverter');

var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');
const moment = require('moment');

// var connection_write = require('../../../connection_write')

const insertLogRequestApi = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        let datetimeNow = moment(new Date()).format('yyyy-MM-dd HH:mm:ss');
        try {
            await client.query('BEGIN');
            var insert_params = {
                table_name: `${DB_SCHEMA_LOG_APP}.log_app_requestapi`,
                insertData: {
                    requestapi_url: `'${params.url}'`,
                    requestapi_header: `'${params.header}'`,
                    requestapi_body: `'${params.body}'`,
                    requestapi_issuedate: `'${dateTimeFormater(new Date(), 'yyyy-MM-dd HH:mm:ss')}'`,
                },
                returns: [],
            };

            var sqlQuery = insertDb(insert_params);
            let rows = await client.query(sqlQuery);

            await client.query('COMMIT');

            if (rows.rows) {
                resolve(rows.rows);
            }
        } catch (err) {
            console.error('err => ', err);
            await client.query('ROLLBACK');
            reject(err);
        } finally {
            client.release();
        }
    });
};

const logUploadFile = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connectionR.connect();
        let datetimeNow = moment(new Date()).format('yyyy-MM-dd HH:mm:ss');

        try {
            await client.query('BEGIN');

            var insert_params = {
                table_name: `${DB_SCHEMA_LOG_APP}.log_app_uploadfile`,
                insertData: {
                    uploadfile_system_type: `'${params.systrm_type || 1}'`,
                    uploadfile_file_originalname: `'${params.original_name}'`,
                    uploadfile_file_systemname: `'${params.file_systemname}'`,
                    uploadfile_file_path: `'${params.file_path}'`,
                    uploadfile_file_type: `'${params.file_type}'`,
                    uploadfile_raw: `'${params.raw}'`,
                    uploadfile_file_bucket: `'${params.bucket_name}'`,
                    uploadfile_issuedate: `'${dateTimeFormater(new Date(), 'yyyy-MM-dd HH:mm:ss')}'`,
                },
                returns: ['uploadfile_id', 'uploadfile_file_path'],
            };
            var sqlQuery = insertDb(insert_params);
            let rows = await client.query(sqlQuery);

            await client.query('COMMIT');

            if (rows.rows) {
                resolve(rows.rows);
            }
        } catch (err) {
            console.error('err => ', err);
            await client.query('ROLLBACK');
            reject(err);
        } finally {
            client.release();
        }
    });
};
module.exports = {
    insertLogRequestApi,

    logUploadFile,
};
