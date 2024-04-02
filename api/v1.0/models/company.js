var { connection } = require('../../../connection');

const CreateCompany = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'INSERT INTO company (company_fullname, company_shortname, company_about, company_domain, company_createdate,company_status, company_delete) VALUES($1,$2,$3,$4,$5,1,0)';
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
                'UPDATE company SET company_fullname = $1, company_shortname = $2, company_about = $3, company_dormain = $4, company_linetoken = $5, company_updatedate = $6  WHERE company_id = $7';
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
            var sqlQuery = 'SELECT * FROM company WHERE company_delete = 0 ORDER BY company_id ';
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
            var sqlQuery = 'UPDATE company SET company_delete = $1 WHERE company_id = $2';
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

// const ReorganizeCompanyIDs = function (companyId) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             var sqlQuery = `UPDATE company SET company_id = company_id - 1 WHERE company_id > $1`;
//             var rows = await client.query(sqlQuery, [companyId]);
//             await client.query("SELECT setval('company_seq', COALESCE((SELECT MAX(company_id) FROM company), 0))");
//             resolve(rows.rows);
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };

const MainCompany = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT company.company_id, company.company_fullname,
            COALESCE(COUNT(company_contact.contact_id), 0) AS count_result, company.company_status
            FROM company
            LEFT JOIN company_contact ON company.company_id = company_contact.contact_companyid
            WHERE company.company_delete = 0
            GROUP BY company.company_id
            ORDER BY company.company_id`;
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
        const sqlQuery = 'UPDATE company SET company_status = $1 WHERE company_id = $2';
        const rows = await client.query(sqlQuery, params);
        return rows.rows;
    } finally {
        client.release();
    }
};



const CountContactCompany = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `
            SELECT company.company_id, COUNT(contact_id)
            FROM company_contact 
            JOIN company ON company_contact.contact_companyid = company.company_id 
            WHERE company.company_id = $1
            GROUP BY company.company_id
            `;
            console.log();
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const ListOfNames = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `
            SELECT 
            company_id,
            contact_id,
            contact_nickname,
            contact_phone,
            contact_email,
            company.company_fullname
            FROM company_contact 
            JOIN company ON company_contact.contact_companyid = company.company_id 
            WHERE company.company_id = $1`;
            console.log();
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
module.exports = {
    CreateCompany,
    updateCompany,
    DatalistByCompany,
    DeleteCompany,
    MainCompany,
    updateCompanyStatus,
    // ReorganizeCompanyIDs,
    // ViewTicket,
    CountContactCompany,
    ListOfNames
};
