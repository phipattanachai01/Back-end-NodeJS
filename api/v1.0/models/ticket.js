const { connection } = require('../../../connection');

const addTicket = function () {
    return new Promise(async (resolve, reject) => {
        client = await connection.connect();
        try {
            await client.query('BEGIN');

            let sqlQuery = `INSERT INTO sys_ticket (ticket_typeid, ticket_title, ticket_issueid, ticket_tag, ticket_companyid, ticket_company_contactid, ticket_cc, ticket_teamid, ticket_userid, ticket_details)
            SELECT 
                (SELECT type_id FROM sys_type WHERE type_name = $1), 
                $2,
                (SELECT issue_id FROM sys_issue WHERE issue_name = $3),
                (SELECT tag_id FROM sys_tags WHERE tag_name = $4),
                (SELECT company_id FROM sys_company WHERE company_fullname = $5),
                (SELECT contact_id FROM sys_company_contact WHERE contact_fullname = $6),
                $7,
                (SELECT team_id FROM set_team WHERE team_name = $8),
                1,
                $9;
            `;
            let rows = client.query(sqlQuery)
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

 

module.exports = {addTicket}