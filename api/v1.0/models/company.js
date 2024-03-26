var { connection } = require('../../../connection');

const CreateCompany = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            var sqlQuery =
                'INSERT INTO company (company_fullname, company_shortname, company_about, company_domain, company_linetoken, company_createdate,company_status, company_delete) VALUES($1,$2,$3,$4,$5,$6,1,0)';
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
            var sqlQuery = 'SELECT * FROM company ORDER BY company_id';
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

const ReorganizeCompanyIDs = function (companyId) {
 return new Promise(async (resolve, reject) => {
    const client = await connection.connect();
    try {
         var sqlQuery = `UPDATE company SET company_id = company_id - 1 WHERE company_id > $1`;
         var rows = await client.query(sqlQuery, [companyId]);
         await client.query(
             "SELECT setval('company_seq', COALESCE((SELECT MAX(company_id) FROM company), 0))"
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

const ViewTicket = function (params) {
    console.log("🚀 ~ ViewTicket ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `
            SELECT
            ticket.ticket_id,
            ticket.ticket_code,
            company_contact.contact_nickname,
            ticket.ticket_type,
            ticket.ticket_title,
            set_issue.issue_priority,
            ticket.ticket_orderdate,
            set_issue.issue_duedate,
            set_issue.issue_type,
            set_team.team_name,
            ticket.ticket_statusid
        FROM
        company
        JOIN
            ticket ON company.company_id = ticket_companyid
        JOIN
            set_issue ON ticket.ticket_issueid = set_issue.issue_id
        JOIN
            company_contact ON ticket.ticket_company_contactid = company_contact.contact_id
        JOIN
            set_status ON ticket.ticket_statusid = set_status.status_id
        JOIN
            set_team ON ticket.ticket_teamid = set_team.team_id
             WHERE company.company_id = $1 AND company.company_delete = 0;
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
 
 
 const ViewCompany = function (params) {
    console.log("🚀 ~ ViewCompany ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `
            SELECT company_id ,
                   contact_nickname ,
                   company_fullname ,
                   contact_email ,
                   contact_phone
            FROM company
            INNER JOIN company_contact ON company.company_id = company_contact.contact_companyid
            WHERE company.company_id = $1 AND company.company_delete = 0;
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
 


module.exports = { CreateCompany, updateCompany, DatalistByCompany, DeleteCompany, MainCompany, updateCompanyStatus , ReorganizeCompanyIDs, ViewTicket, ViewCompany};
