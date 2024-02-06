var { connection } = require('../../../connection');

const Mainrole = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery = console.log();
            let rows = await client.query(sqlQuery, data);
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

const Addrole = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            let roleQuery = `
                INSERT INTO sys_role (role_name, role_status)
                VALUES ($1, 1)
            `;
            let roleParams = [data[0]];
            await client.query(roleQuery, roleParams);

            for (let i = 1; i < data.length; i++) {
                let menuQuery = `
                    INSERT INTO sys_role_menu (role_menu_roleid, role_menu_menuid, role_menu_permissions)
                    VALUES (
                        (SELECT role_id FROM sys_role ORDER BY role_id DESC LIMIT 1),
                        (SELECT menu_id FROM sys_menu WHERE menu_name = $1),
                        $2
                    ) ON CONFLICT DO NOTHING
                `;
                let menuParams = [getMenuName(i), data[i]];
                let menuResult = await client.query(menuQuery, menuParams);
            }

            await client.query('COMMIT');
            let responseData = {
                roleName: data[0],
                Dashboard: data[1],
                Notify: data[2],
                Ticket: data[3],
                Company: data[4],
                Structures: data[5],
                General: data[6],
            };
            resolve(responseData);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

function getMenuName(index) {
    switch (index) {
        case 1:
            return 'Dashboard';
        case 2:
            return 'Notify';
        case 3:
            return 'Ticket';
        case 4:
            return 'Company';
        case 5:
            return 'Structures';
        case 6:
            return 'General';
        default:
            return '';
    }
}

module.exports = { Mainrole, Addrole };
