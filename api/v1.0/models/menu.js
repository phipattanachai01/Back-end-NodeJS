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

const Updatemenu = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            for (let i = 0; i < data.role_menu.length; i++) {
                let menu = data.role_menu[i];
                console.log("🚀 ~ returnnewPromise ~ menu:", menu)
                let menuQuery = `UPDATE sys_menu SET menu_status = $1, menu_updatedate WHERE menu_id = $2`;
                let rows = await client.query(menuQuery, [menu.menu_status, menu.menu_id]);
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



module.exports = {mainmenu,Updatemenu}