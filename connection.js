const { Pool, Client } = require('pg');
var Minio = require('minio');
const { dbConfigR, dbConfigW, dbConfigSQL, minioConfig } = require('./config/default');

const sql = require('mssql');

const connectionR = new Pool({
    user: dbConfigR.user,
    host: dbConfigR.host,
    database: dbConfigR.database,
    password: dbConfigR.password,
    port: dbConfigR.port,
});

const connectionW = new Pool({
    user: dbConfigW.user,
    host: dbConfigW.host,
    database: dbConfigW.database,
    password: dbConfigW.password,
    port: dbConfigW.port,
});

const connection = new Pool({
    user: dbConfigR.user,
    host: dbConfigR.host,
    database: dbConfigR.database,
    password: dbConfigR.password,
    port: dbConfigR.port,
});

try {
    var minioClient = new Minio.Client({
        endPoint: minioConfig.endPoint,
        port: Number(minioConfig.port),
        useSSL: minioConfig.useSSL === 'true',
        accessKey: minioConfig.accessKey,
        secretKey: minioConfig.secretKey,
    });
} catch (error) {
    console.log(error);
}

const minioconnection = minioClient;

module.exports = { connectionW, connectionR, connection, minioconnection };
