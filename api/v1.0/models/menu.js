var { connection } = require('../../../connection');
const mainmenu = function (param) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let menuQuery = `SELECT * FROM sys_menu ORDER BY sys_menu`;
            let rows = await client.query(menuQuery , param);
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

const Updatemenu = function (data , formattedupdateDateTime) {
    console.log("🚀 ~ Updatemenu ~ data:", data)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            for (let i = 0; i < data.role_menu.length; i++) {
                let menu = data.role_menu[i];
                let menuQuery = `UPDATE sys_menu SET menu_status = $1, menu_updatedate = $2 WHERE menu_id = $3`;
                let rows = await client.query(menuQuery, [menu.menu_status, formattedupdateDateTime, menu.menu_id]);
                // console.log(rows);
            }
            resolve({
               role_menu: data.role_menu
            });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const sideMenu = async function (params) {
    return new Promise (async(resolve, reject) => {
        const client = await connection.connect();
        try {
            let role = params.role;
             let sqlQuery = `SELECT 
             sys_menu.menu_id, sys_menu.menu_name, sys_menu.menu_url, sys_menu.menu_icon, sys_menu.menu_parents,
             sys_role_menu.role_menu_id, sys_role_menu.role_menu_roleid, sys_role_menu.role_menu_menuid , sys_role_menu.role_menu_permissions
         FROM 
             sys_menu
         JOIN 
             sys_role_menu ON sys_menu.menu_id = sys_role_menu.role_menu_menuid
         JOIN
             sys_role ON sys_role.role_id = sys_role_menu.role_menu_roleid
         WHERE 
             sys_role_menu.role_menu_menuid = sys_menu.menu_id
             AND sys_role.role_id = $1
             AND sys_menu.menu_status = 1
             AND sys_role_menu.role_menu_permissions != 'NA'
        ORDER BY sys_menu.menu_id
         `;
             let rows = await client.query(sqlQuery, [role]);
             resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    })
}

module.exports = { mainmenu,
    Updatemenu,
    sideMenu
}