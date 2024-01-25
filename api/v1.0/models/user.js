var { connection } = require('../../../connection');
const adduse = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'INSERT INTO sys_user (user_name, user_phone, user_firstname, user_lastname, user_password) VALUES($1,$2,$3,$4,$5)';
            console.log();
            let rows = await client.query(sqlQuery, params);
            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const userlistByusername = function (paramuser) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = 'SELECT * FROM sys_user WHERE user_name  = $1 ';
            console.log();
            let rows = await client.query(sqlQuery, paramuser);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const updateUser = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE users SET user_name = $1, user_phone = $2, user_fullname = $3  WHERE user_id = $4';
            console.log();
            let rows = await client.query(sqlQuery, params);
            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const deleteUser = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery = 'DELETE FROM users WHERE user_id = $1';
            console.log();
            let rows = await client.query(sqlQuery, params);
            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const changePasswordUser = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE users SET user_password = $1  WHERE user_id = $2';
            console.log();
            let rows = await client.query(sqlQuery, params);
            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

module.exports = { adduse, userlistByusername, updateUser, deleteUser, changePasswordUser };
