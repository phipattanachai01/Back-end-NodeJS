var { connection } = require('../../../connection');
// let { getMenuName } = require('../middleware/formatConverter');

const Mainrole = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT
            sys_role.role_id,
            sys_role.role_name,
            sys_role.role_status,
            sys_role.role_createdate,
            COUNT(sys_user.user_roleid) AS userCount
            FROM sys_role
            LEFT JOIN sys_user ON sys_role.role_id = sys_user.user_roleid
            WHERE sys_role.role_delete = 0
            GROUP BY sys_role.role_id, sys_role.role_name, sys_role.role_status, sys_role.role_createdate
            ORDER BY sys_role.role_id`;
            let rows = await client.query(sqlQuery);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const roleusers = function () {
    return new Promise(async(resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT role_id, role_name FROM sys_role ORDER BY role_id`;
            console.log();
            let rows = await client.query(sqlQuery);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    } );
}
// const Addrole = function (data) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             await client.query('BEGIN');

//             let roleQuery = `INSERT INTO sys_role (role_name, role_status) VALUES ($1, 1) RETURNING role_id`;
//             let roleParams = [data.role_name];
//             // console.log(roleParams);
//             const roleResult = await client.query(roleQuery, roleParams);
//             const roleId = roleResult.rows[0].role_id;
//             // console.log(roleId);

//             for (let menu of data.role_menu) {

//                 let menuQuery = `SELECT menu_id FROM sys_menu WHERE menu_id = $1`;
//                 let menuParams = [menu.menu_id];
//                 const menuResult = await client.query(menuQuery, menuParams);
//                 const menuId = menuResult.rows[0].menu_id;
//                 // console.log(menuId);

//                 let roleMenuQuery = `INSERT INTO sys_role_menu (role_menu_roleid, role_menu_menuid, role_menu_permissions) VALUES ($1, $2, $3)`;
//                 let roleMenuParams = [roleId, menuId, menu.role_menu_permissions];
//                 await client.query(roleMenuQuery, roleMenuParams);
//             }

//             await client.query('COMMIT');

//             resolve({
//                 role_id: roleId,
//                 role_name: data.role_name,
//                 role_menu: data.role_menu
//             });
//         } catch (error) {
//             await client.query('ROLLBACK');
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };

const Addrole = function (data, formattedDateTime) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            let roleQuery = `INSERT INTO sys_role (role_name, role_status, role_delete, role_createdate) VALUES ($1, 1, 0, $2) RETURNING role_id`;
            let roleParams = [data.role_name, formattedDateTime];
            const roleResult = await client.query(roleQuery, roleParams);
            const roleId = roleResult.rows[0].role_id;

            for (let menu of data.role_menu) {
                let menuQuery = `SELECT menu_id FROM sys_menu WHERE menu_id = $1`;
                let menuParams = [menu.menu_id];
                const menuResult = await client.query(menuQuery, menuParams);
                const menuId = menuResult.rows[0].menu_id;

                if (menu.role_menu_permissions !== null) {
                    let roleMenuQuery = `INSERT INTO sys_role_menu (role_menu_roleid, role_menu_menuid, role_menu_permissions, role_menu_createdate) VALUES ($1, $2, $3, $4)`;
                    let roleMenuParams = [roleId, menuId, menu.role_menu_permissions, formattedDateTime];
                    await client.query(roleMenuQuery, roleMenuParams);
                } else {
                    throw new Error('Invalid role_menu_permissions for menu_id: ' + menu.menu_id);
                }
            }

            await client.query('COMMIT');

            resolve({
                role_id: roleId,
                role_name: data.role_name,
                role_menu: data.role_menu,
            });
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const Editrole = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            let roleUpdateQuery = `UPDATE sys_role SET role_name = $1 ,role_updatedate = $2 WHERE role_id = $3`;
            
            let rows = await client.query(roleUpdateQuery, [data[0], data[2], data[3]]);

            
            for (let menu of data.role_menu) {
                let menuQuery = `SELECT menu_id FROM sys_menu WHERE menu_id = $1`;
                let menuParams = [menu.menu_id];
                const menuResult = await client.query(menuQuery, menuParams);
                const menuId = menuResult.rows[0].menu_id;
                
                let roleMenuUpdateQuery = `UPDATE sys_role_menu SET role_menu_permissions = $1, role_menu_updatedate = $2 WHERE role_menu_roleid = $3 AND role_menu_menuid = $4`;
                let roleMenuUpdateParams = [menu.role_menu_permissions, data[2], data[3], menuId];
                await client.query(roleMenuUpdateQuery, roleMenuUpdateParams);
            }

            await client.query('COMMIT');

            resolve({
                role_id: roleId,
                role_name: data.role_name,
                role_menu: data.role_menu,
            });
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const Deleterole = function (roleId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            let deleteRoleMenuQuery = `
                UPDATE sys_role SET role_delete = 1 
                WHERE role_id = $1
            `;
            await client.query(deleteRoleMenuQuery, roleId);

            await client.query('COMMIT');
            resolve(roleId);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

// const ReorganizeRoleIDs = function (roleId) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             const reorganizeQuery = `
//                 UPDATE sys_role
//                 SET role_id = role_id - 1
//                 WHERE role_id > $1
//             `;
//             await client.query(reorganizeQuery, [roleId]);

//             resolve(true);
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };
module.exports = { Mainrole, Addrole, Editrole, Deleterole ,roleusers};
