const { connection } = require('../../../connection');

const addTicket = function (params) {
    return new Promise(async (resolve, reject) => {
        client = await connection.connect();
        try {
            await client.query('BEGIN');

            let sqlQuery = `INSERT INTO ticket (ticket_code, ticket_orderdate, ticket_notification_status, ticket_statusid, ticket_type, ticket_title, ticket_issueid, ticket_companyid, ticket_company_contactid, ticket_cc, ticket_teamid, ticket_userid, ticket_details, ticket_delete, ticket_createdate)
            VALUES ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, $13)`;
            let rows = client.query(sqlQuery, params);
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
async function getLatestTicketCodeNumberFromDatabase() {
    const client = await connection.connect();
    try {
        const queryResult = await client.query('SELECT MAX(CAST(SUBSTRING(ticket_code, 10) AS INTEGER)) AS max_ticket_code_number FROM ticket');
        const maxTicketCodeNumber = queryResult.rows[0].max_ticket_code_number || 0;
        return maxTicketCodeNumber;
    } catch (error) {
        throw error;
    }
};



module.exports = { addTicket , getLatestTicketCodeNumberFromDatabase};
