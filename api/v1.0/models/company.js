var { connection } = require('../../../connection');

const CreateCompany = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'INSERT INTO sys_company (company_fullname, company_shortname, company_about, company_dormain, company_linetoken, company_createdate,company_status) VALUES($1,$2,$3,$4,$5,$6,1)';
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

const updateCompany = function (params) {
    // console.log("🚀 ~ updateCompany ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'UPDATE sys_company SET company_fullname = $1, company_shortname = $2, company_about = $3, company_dormain = $4, company_linetoken = $5, company_updatedate = $6  WHERE company_id = $7';
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

const DatalistByCompany = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = 'SELECT * FROM sys_company ORDER BY company_id';
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
};

const DeleteCompany = function (companyId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = 'DELETE FROM sys_company WHERE company_id = $1';
            console.log();
            let rows = await client.query(sqlQuery, [companyId]);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const ReorganizeCompanyIDs = function (companyId) {
 return new Promise(async (resolve, reject) => {
    const client = await connection.connect();
    try {
         var sqlQuery = `UPDATE sys_company SET company_id = company_id - 1 WHERE company_id > $1`;
         var rows = await client.query(sqlQuery, [companyId]);
         await client.query(
             "SELECT setval('sys_company_seq', COALESCE((SELECT MAX(company_id) FROM sys_company), 0))"
         );
         resolve(rows.rows);
    } catch (error) {
        reject(error);
        console.log(error);
    } finally {
        client.release();
    }
 })
}

const MainCompany = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT sys_company.company_id, sys_company.company_fullname,
            COALESCE(COUNT(sys_company_contact.contact_id), 0) AS count_result, sys_company.company_status
            FROM sys_company
            LEFT JOIN sys_company_contact ON sys_company.company_id = sys_company_contact.contact_companyid
            GROUP BY sys_company.company_id
            ORDER BY sys_company.company_id`;
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

const updateCompanyStatus = async function (params) {
    const client = await connection.connect();
    try {
        const sqlQuery = 'UPDATE sys_company SET company_status = $1 WHERE company_id = $2';
        const rows = await client.query(sqlQuery, params);
        return rows.rows;
    } finally {
        client.release();
    }
};


module.exports = { CreateCompany, updateCompany, DatalistByCompany, DeleteCompany, MainCompany, updateCompanyStatus , ReorganizeCompanyIDs};
