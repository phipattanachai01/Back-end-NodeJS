// const { connection } = require('../../../connection');

// const addTicket = function (params) {
//     return new Promise(async (resolve, reject) => {
//         client = await connection.connect();
//         try {
//             await client.query('BEGIN');

//             let sqlQuery = `INSERT INTO ticket (ticket_code, ticket_orderdate, ticket_notification_status, ticket_statusid, ticket_type, ticket_title, ticket_issueid, ticket_tagid, ticket_companyid, ticket_company_contactid, ticket_cc, ticket_teamid, ticket_userid, ticket_details, ticket_delete, ticket_createdate)
//             VALUES ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, $14)`;
//             let rows = client.query(sqlQuery, params);
//             await client.query('COMMIT');
//             resolve(rows.rows);
//         } catch (error) {
//             await client.query('ROLLBACK');
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };
// // async function getLatestTicketCodeNumberFromDatabase() {
// //     const client = await connection.connect();
// //     try {
// //         const queryResult = await client.query('SELECT MAX(CAST(SUBSTRING(ticket_code, 10) AS INTEGER)) AS max_ticket_code_number FROM ticket');
// //         const maxTicketCodeNumber = queryResult.rows[0].max_ticket_code_number || 0;
// //         return maxTicketCodeNumber;
// //     } catch (error) {
// //         throw error;
// //     }
// // };

// module.exports = { addTicket ,
//     // getLatestTicketCodeNumberFromDatabase
// };

const { generateTicketCode } = require('../middleware/formatConverter');
const { connection } = require('../../../connection');
const { query } = require('mssql');

const MainTicket = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT 
            ticket.ticket_id, 
            ticket.ticket_code, 
            ticket.ticket_orderdate, 
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_shortname,
            set_issue.issue_priority, 
            set_issue.issue_duedate, 
            set_issue.issue_type,
            ticket_status.ticket_status_statusid,
            set_team.team_name
        FROM 
            ticket
        JOIN 
            set_issue ON ticket.ticket_issueid = set_issue.issue_id
        JOIN 
            company ON ticket.ticket_companyid = company.company_id
        JOIN 
            ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid 
        JOIN 
            set_team ON ticket.ticket_teamid = set_team.team_id
        ORDER BY ticket.ticket_id;
        `;
            let rows = await client.query(sqlQuery);
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};
// const addTicket = async function (params) {
//     return new Promise(async (resolve, reject) => {
//     const client = await connection.connect();
//     try {
//         await client.query('BEGIN');

//         const maxTicketCodeNumber = await getLatestTicketCodeNumberFromDatabase(client);

//         const newTicketCode = generateTicketCode(maxTicketCodeNumber);

//         let sqlQuery = `INSERT INTO ticket (ticket_code, ticket_orderdate, ticket_notification_status, ticket_statusid, ticket_type, ticket_title, ticket_issueid, ticket_tagid, ticket_companyid, ticket_company_contactid, ticket_cc, ticket_teamid, ticket_userid, ticket_delete, ticket_createdate)
//         VALUES ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, $13)`;
//         let { rows: ticketRows } = await client.query(sqlQuery, [newTicketCode, ...params]);
//             let ticket_id = ticketRows[0].ticket_id;

//             let sqlQueryTicketDetail = `INSERT INTO ticket_detail (detail_userid, detail_ticketid, detail_type, detail_details, detail_createdate) VALUES ($14, $15, 0, $16, $17)`
//             let rows3 = await client.query(sqlQueryTicketDetail, [params[12], ticket_id, params[14], new Date()]);

//             await client.query('COMMIT');
//             resolve(ticketRows);
//     } catch (error) {
//         await client.query('ROLLBACK');
//         reject (error);
//     } finally {
//         client.release();
//     }
// });

// };

// const addTicket = async function (params) {
//     console.log("🚀 ~ addTicket ~ params:", params)
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             await client.query('BEGIN');

//             const maxTicketCodeNumber = await getLatestTicketCodeNumberFromDatabase(client);
//             const newTicketCode = generateTicketCode(maxTicketCodeNumber);

//             let sqlQuery = `INSERT INTO ticket (ticket_code, ticket_orderdate, ticket_notification_status, ticket_statusid, ticket_type, ticket_title, ticket_issueid, ticket_tagid, ticket_companyid, ticket_company_contactid, ticket_cc, ticket_teamid, ticket_userid, ticket_delete, ticket_createdate)
//                 VALUES ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, $13)`;
//             let { rows: ticketRows } = await client.query(sqlQuery, [newTicketCode, ...Object.values(params)]);
//             console.log("🚀 ~ returnnewPromise ~ rows:", {rows: ticketRows})

//             let ticket_id = ticketRows[0].ticket_id;
//             console.log("🚀 ~ returnnewPromise ~ ticket_id:", ticket_id)

//             let sqlQueryTicketDetail = `INSERT INTO ticket_detail (detail_userid, detail_ticketid, detail_type, detail_details, detail_createdate)
//                 VALUES ($14, $15, 0, $16, $17)`;
//             let rows3 = await client.query(sqlQueryTicketDetail, [params.ticket_userid, ticket_id, params.detail_details, new Date()]);

//             await client.query('COMMIT');
//             resolve(ticketRows);
//         } catch (error) {
//             await client.query('ROLLBACK');
//             reject(error);
//         } finally {
//             client.release();
//         }
//     });
// };



const addTicket = async function (params) {
    console.log("🚀 ~ addTicket ~ params:", params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            const maxTicketCodeNumber = await getLatestTicketCodeNumberFromDatabase(client);
            const newTicketCode = generateTicketCode(maxTicketCodeNumber);
            console.log('🚀 ~ returnnewPromise ~ newTicketCode:', newTicketCode);

            let sqlQueryTicket = `
            INSERT INTO ticket (
                ticket_code, ticket_orderdate, ticket_notification_status, 
                 ticket_type, ticket_title, ticket_issueid, 
                 ticket_companyid, ticket_company_contactid, 
                ticket_cc, ticket_teamid, ticket_delete, 
                ticket_createdate)
            VALUES (
                $1, $2, $3, $4,  $5, $6, $7, $8, $9, $10, 0, $11)
            RETURNING ticket_id,  ticket_createdate , ticket_teamid , ticket_code , ticket_title`;
            
            
            let ticketRows = await client.query(sqlQueryTicket, [
                newTicketCode,
                params[0],  // ticket_orderdate
                params[1],  // ticket_notification_status
                params[2],  // ticket_type
                params[3],  // ticket_title
                params[4],  // ticket_issueid
                params[5],  // ticket_companyid
                params[6],  // ticket_company_contactid
                params[7],  // ticket_cc
                params[8],  // ticket_teamid
                params[9],  // ticket_createdate
            ]);


            let ticket_id = ticketRows.rows[0].ticket_id;
            console.log('🚀 ~ returnnewPromise ~ ticket_id:', ticket_id);

            let ticket_code = ticketRows.rows[0].ticket_code;

            let ticket_title = ticketRows.rows[0].ticket_title;

            // let ticket_statusid = ticketRows.rows[0].ticket_statusid;
            // console.log("🚀 ~ returnnewPromise ~ ticket_statusid:", ticket_statusid)
            
            // let ticket_userid = ticketRows.rows[0].ticket_userid;
            
            let ticket_createdate = ticketRows.rows[0].ticket_createdate;
            
            let ticket_teamid = ticketRows.rows[0].ticket_teamid;

            let sqlQueryTicketAssign = `INSERT INTO ticket_assign (assign_ticketid, assign_teamid, assign_userid, assign_createdate) VALUES ($1, $2, unnest($3::int[]), $4) RETURNING assign_userid`;
            let rowsTicketAssign = await client.query(sqlQueryTicketAssign, [ticket_id, ticket_teamid, params[10], ticket_createdate]);
            console.log("🚀 ~ returnnewPromise ~ rowsTicketAssign:", rowsTicketAssign)

            let assignUserIds = rowsTicketAssign.rows.map(row => row.assign_userid);
            console.log("🚀 ~ returnnewPromise ~ assign_userid:", assignUserIds)

            let sqlQueryTag = `INSERT INTO ticket_tags (ticket_tags_tagid,ticket_tags_ticketid, ticket_tags_createdate) VALUES (unnest($1::int[]), $2, $3)`;
            let rowsTag = await client.query(sqlQueryTag, [params[11], ticket_id, ticket_createdate]);
            console.log("🚀 ~ returnnewPromise ~ rowsTag:", rowsTag)
            
            let sqlQueryTicketDetail = `
                INSERT INTO ticket_detail (
                    detail_userid, detail_ticketid, detail_type, 
                    detail_details, detail_createdate
                ) VALUES ($1, $2, 0, $3, $4)`;

            let rowsTicketDetail = await client.query(sqlQueryTicketDetail,[params[13], ticket_id, params[12], ticket_createdate]);

            let sqlQueryTicketStatus = `
                INSERT INTO ticket_status (
                    ticket_status_statusid, ticket_status_ticketid, ticket_status_createdate
                ) VALUES (1, $1, $2)`;

            let rowsTicketStatus = await client.query(sqlQueryTicketStatus, [
                ticket_id,
                ticket_createdate
            ]);
            console.log("🚀 ~ returnnewPromise ~ rowsTicketStatus:", rowsTicketStatus)

            let notifyDetail = `${ticket_title} Ticket code: ${ticket_code}`;
            for (let userId of assignUserIds) {
                console.log("🚀 ~ returnnewPromise ~ notifyDetail:", notifyDetail)
                let sqlQueryTicketNotifications = `
                    INSERT INTO noti_message (notify_ticketid, notify_userid, notify_status, notify_topic, notify_detail, notify_createdate)
                    VALUES ($1, $2, 0, 'คำสั่ง Ticket ใหม่', $3, $4)`;
                
                let rowsNotifications = await client.query(sqlQueryTicketNotifications, [ticket_id, userId, notifyDetail, ticket_createdate]);
                console.log("🚀 ~ returnnewPromise ~ rowsNotifications:", rowsNotifications);
            }
            
            await client.query('COMMIT');
            resolve(rowsTicketStatus);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};


const DataCompany = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            const sqlQuery = await client.query(`SELECT 
            company.company_id, 
            company.company_fullname 
        FROM company`);
            resolve(sqlQuery.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const DatacontactByCompany = async function (contactcompany) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT contact_id, contact_fullname, contact_email
        FROM company_contact
        WHERE contact_companyid = $1`;
            let rows = await client.query(sqlQuery, contactcompany);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const assignUser = async function (taem_id) {
    console.log('🚀 ~ assignUser ~ taemId:', taem_id);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT  sys_user.user_id, sys_user.user_firstname
        FROM sys_user 
        JOIN set_team_user  ON sys_user.user_id = set_team_user.team_user_userid
        JOIN set_team  ON set_team_user.team_user_teamid = set_team.team_id
        WHERE set_team.team_id = $1`;
            let rows = await client.query(sqlQuery, [taem_id]);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const DataNotification = async function (ticket_id) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT ticket.ticket_createdate, set_issue.issue_duedate, set_issue.issue_type
            FROM ticket
            INNER JOIN set_issue ON ticket.ticket_issueid = set_issue.issue_id
            WHERE ticket.ticket_id = $1`;
            let rows = await client.query(sqlQuery, ticket_id);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};
async function getLatestTicketCodeNumberFromDatabase(client) {
    try {
        const queryResult = await client.query(
            'SELECT MAX(CAST(SUBSTRING(ticket_code, 11) AS INTEGER)) AS max_ticket_code_number FROM ticket'
        );
        const maxTicketCodeNumber = queryResult.rows[0].max_ticket_code_number || 0;
        return maxTicketCodeNumber;
    } catch (error) {
        throw error;
    }
}

module.exports = { MainTicket, addTicket, DataCompany, DatacontactByCompany, assignUser, DataNotification };
