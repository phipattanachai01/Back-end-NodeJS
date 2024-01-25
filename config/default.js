// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    dbConfigR: {
        host: process.env.DBR_PG_HOST,
        user: process.env.DBR_PG_USER,
        password: process.env.DBR_PG_PASS,
        database: process.env.DBR_PG_NAME,
        port: process.env.DBR_PG_PORT,
    },
    dbConfigW: {
        host: process.env.DBW_PG_HOST,
        user: process.env.DBW_PG_USER,
        password: process.env.DBW_PG_PASS,
        database: process.env.DBW_PG_NAME,
        port: process.env.DBW_PG_PORT,
    },
    dbConfigSQL: {
        server: process.env.DBSQL_PG_HOST,
        user: process.env.DBSQL_PG_USER,
        password: process.env.DBSQL_PG_PASS,
        database: process.env.DBSQL_PG_NAME,
        // port: process.env.DBSQL_PG_PORT,
    },

    minioConfig: {
        endPoint: process.env.MINIO_ENDPOINT,
        port: process.env.MINIO_PORT,
        useSSL: process.env.MINIO_USESSL,
        accessKey: process.env.MINIO_ACCESSKEY,
        secretKey: process.env.MINIO_SECRETKEY,
        view_url: process.env.MINIO_VIEWURL,
    },
    CONFIG_SECRET: process.env.CONFIG_SECRET,
    PORT: process.env.PORT,
    SERVER: process.env.SERVER,
    FIXDATA: Boolean(process.env.FIXDATA) || true,
    DB_SCHEMA_1: process.env.DB_SCHEMA_1,
    DB_SCHEMA_2: process.env.DB_SCHEMA_2,
    DB_SCHEMA_3: process.env.DB_SCHEMA_3,
    IMAGE_URL: process.env.IMAGE_URL,
    SAP_APIURL: process.env.SAP_APIURL,
    URLAPI: process.env.URLAPI,
    MINIO_URL: process.env.MINIO_URL,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    JWT_SECRET: process.env.TOKEN_SECRET,
};
