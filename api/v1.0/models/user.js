const { rows } = require('mssql');
var { connection } = require('../../../connection');
const adduse = function (params) {
    console.log("🚀 ~ adduse ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'INSERT INTO sys_user (user_name, user_phone, user_firstname, user_lastname, user_password, user_createdate, user_roleid, user_createby, user_status, user_delete, user_language, user_path, user_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, 1, 0, 1, $9, $10)';
            console.log();
            let rows = await client.query(sqlQuery, params);
            await client.query('COMMIT');
            resolve('Successfully');
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
            user_roleid,
            user_url,
            user_path
        FROM 
            sys_user
        JOIN 
            sys_role  ON sys_user.user_roleid = role_id
        WHERE user_delete = 0
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
            var sqlQuery = `SELECT user_id, user_name, 
            user_status, user_password, user_delete,
            role_id FROM sys_user JOIN sys_role 
            ON sys_user.user_roleid = sys_role.role_id 
            WHERE user_name  = $1 AND user_status = 1 AND user_delete = 0`;
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
    console.log("🚀 ~ updateUser ~ params:", params)
    // console.log(userID)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE sys_user SET user_name = $1, user_phone = $2, user_firstname = $3, user_lastname = $4, user_password = $5,  user_roleid = $6, user_url = $7, user_path = $8, user_updatedate = $9 WHERE user_id = $10';
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

// $2a$10$xgZ4IV66DkULzmXYNBm5XO.r2yhJj6y6OZv9iS28cQXe9TXpn/s6W

const deleteUser = function (userID) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery = `UPDATE sys_user SET user_delete = 1 WHERE user_id = $1
            `;
            console.log();
            let rows = await client.query(sqlQuery, userID);
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
// const ReorganizeUserIDs = function(userID) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             const reorganizeQuery = `
//                 UPDATE sys_user
//                 SET user_id = user_id - 1
//                 WHERE user_id > $1
//             `;
//             await client.query(reorganizeQuery, [userID]);
//             await client.query("SELECT setval('sys_user_seq', COALESCE((SELECT MAX(user_id) FROM sys_user), 0))");

//             resolve(true);
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// }
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

const checkUserExists = async function (username) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            const query = 'SELECT * FROM sys_user WHERE user_name = $1';
            const rows = await client.query(query, [username]);
            resolve(rows.rows.length > 0);
            console.log("🚀 ~ returnnewPromise ~ result:", rows.rows.length > 0);

        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const dataEdit = async function (params) {
    console.log("🚀 ~ dataEdit ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let query = `SELECT *,role_name FROM sys_user 
            JOIN sys_role ON sys_user.user_roleid = sys_role.role_id 
            WHERE user_id = $1 AND user_delete = 0`;
            let rows = await client.query(query, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const roleUser = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let query = `SELECT sys_role.role_id , sys_role.role_name  FROM sys_role WHERE sys_role.role_status = 1 AND sys_role.role_delete = 0`;
            let rows = await client.query(query);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
}

module.exports = { adduse, loginuser, updateUser, deleteUser, changePasswordUser , updateStatus, mainlistByUser , checkUserExists, dataEdit, roleUser};
