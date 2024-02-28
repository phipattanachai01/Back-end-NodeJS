var { connection } = require('../../../connection');
const adduse = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'INSERT INTO sys_user (user_name, user_phone, user_firstname, user_lastname, user_password, user_createdate, user_roleid, user_status) VALUES ($1,$2,$3,$4,$5,$6, (SELECT role_id FROM sys_role WHERE role_name = $7), 1)';
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

const mainlistByUser = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT 
            user_id, 
            user_firstname, 
            user_lastname, 
            user_image, 
            user_phone, 
            user_name, 
            role_name AS user_role, 
            user_status,
            user_roleid
        FROM 
            sys_user
        JOIN 
            sys_role  ON sys_user.user_roleid = role_id
        ORDER BY 
            user_id;
        `;
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
const loginuser = function (paramuser) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = 'SELECT * FROM sys_user WHERE user_name  = $1 AND user_status = 1';
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
    // console.log(userID)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE sys_user SET user_name = $1, user_phone = $2, user_firstname = $3, user_lastname = $4, user_updatedate = $5 WHERE user_id = $6';
            // console.log(sqlQuery);
            // console.log('combinedParams', combinedParams);
            let rows = await client.query(sqlQuery, params);
            // console.log(rows);
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

const deleteUser = function (userID) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery = `WITH deleted_user AS (
                DELETE FROM sys_user 
                WHERE user_id = $1
                RETURNING user_id
            )
            UPDATE sys_user 
            SET user_id = user_id - 1
            WHERE user_id > $1
            AND user_id NOT IN (SELECT user_id FROM sys_user)
            AND user_id <> 1
            `;
            console.log();
            let rows = await client.query(sqlQuery, [userID]);
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
const ReorganizeUserIDs = function(userID) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            const reorganizeQuery = `
                UPDATE sys_user
                SET user_id = user_id - 1
                WHERE user_id > $1
            `;
            await client.query(reorganizeQuery, [userID]);
            await client.query("SELECT setval('sys_user_seq', COALESCE((SELECT MAX(user_id) FROM sys_user), 0))");

            resolve(true);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
}
const changePasswordUser = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE sys_user SET user_password = $1  WHERE user_id = $2';
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
const updateStatus = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE sys_user SET user_status = $1  WHERE user_id = $2';
            console.log();
            
            let rows = await client.query(sqlQuery, params);
            console.log("🚀 ~ returnnewPromise ~ rows:", rows)
            
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
}

module.exports = { adduse, loginuser, updateUser, deleteUser, changePasswordUser, ReorganizeUserIDs , updateStatus, mainlistByUser};
