const { generateTicketCode } = require('../middleware/formatConverter');
const { connection } = require('../../../connection');

const MainTicket = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT
            ticket.ticket_id, 
            ticket.ticket_code, 
            ticket.ticket_orderdate, 
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_id,
            company.company_shortname,
            company.company_fullname,
            company_contact.contact_nickname,
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
            company_contact ON ticket.ticket_company_contactid = company_contact.contact_id
        JOIN 
            ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid 
        JOIN 
            set_team ON ticket.ticket_teamid = set_team.team_id
        JOIN
            ticket_detail ON ticket.ticket_id = ticket_detail.detail_ticketid
            WHERE ticket.ticket_delete = 0
        GROUP BY 
            ticket.ticket_id,
            ticket.ticket_code, 
            ticket.ticket_orderdate, 
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_id,
            company.company_shortname,
            company.company_fullname,
            company_contact.contact_nickname,
            set_issue.issue_priority, 
            set_issue.issue_duedate, 
            set_issue.issue_type,
            ticket_status.ticket_status_statusid,
            set_team.team_name
            `; 
            if (params && params[0] !== null) { 
                sqlQuery += ` AND ticket.ticket_companyid = $1`; 

                sqlQuery += ` ORDER BY ticket.ticket_id`;
                let rows = await client.query(sqlQuery, params);
                resolve(rows.rows);
            } else {
                sqlQuery += ` ORDER BY ticket.ticket_id`;
                let rows = await client.query(sqlQuery);
                resolve(rows.rows);
            }
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const countTicket = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT
            COUNT(ticket.ticket_id) AS total_tickets,
            SUM(CASE WHEN ticket_status.ticket_status_statusid = 1 THEN 1 ELSE 0 END) AS tickets_status_1,
            SUM(CASE WHEN ticket_status.ticket_status_statusid = 2 THEN 1 ELSE 0 END) AS tickets_status_2,
            SUM(CASE WHEN ticket_status.ticket_status_statusid = 3 THEN 1 ELSE 0 END) AS tickets_status_3,
            SUM(CASE WHEN ticket_status.ticket_status_statusid = 4 THEN 1 ELSE 0 END) AS tickets_status_4,
            SUM(CASE WHEN ticket_status.ticket_status_statusid = 5 THEN 1 ELSE 0 END) AS tickets_status_5,
            SUM(CASE WHEN ticket_status.ticket_status_statusid = 6 THEN 1 ELSE 0 END) AS tickets_status_6
        FROM
            ticket
        JOIN
            ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid
        WHERE ticket.ticket_delete = 0`;
            
        if (params && params[0] !== null) {
            sqlQuery += ` AND ticket.ticket_id = $1`;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows[0]);
        } else {
            let rows = await client.query(sqlQuery);
            resolve(rows.rows[0]);
        }
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
}

const addTicket = async function (params) {
    console.log('🚀 ~ addTicket ~ params:', params[13]);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            const maxTicketCodeNumber = await getLatestTicketCodeNumberFromDatabase(client);
            const newTicketCode = generateTicketCode(maxTicketCodeNumber);
            // console.log('🚀 ~ returnnewPromise ~ newTicketCode:', newTicketCode);

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
                params[0], // ticket_orderdate
                params[1], // ticket_notification_status
                params[2], // ticket_type
                params[3], // ticket_title
                params[4], // ticket_issueid
                params[5], // ticket_companyid
                params[6], // ticket_company_contactid
                params[7], // ticket_cc
                params[8], // ticket_teamid
                params[9], // ticket_createdate
            ]);

            let ticket_id = ticketRows.rows[0].ticket_id;
            // console.log('🚀 ~ returnnewPromise ~ ticket_id:', ticket_id);

            let ticket_code = ticketRows.rows[0].ticket_code;

            let ticket_title = ticketRows.rows[0].ticket_title;

            let ticket_createdate = ticketRows.rows[0].ticket_createdate;

            let ticket_teamid = ticketRows.rows[0].ticket_teamid;

            let sqlQueryTicketAssign = `INSERT INTO ticket_assign (assign_ticketid, assign_teamid, assign_userid, assign_createdate) VALUES ($1, $2, unnest($3::int[]), $4) RETURNING assign_userid`;
            let rowsTicketAssign = await client.query(sqlQueryTicketAssign, [
                ticket_id,
                ticket_teamid,
                params[10],
                ticket_createdate,
            ]);
            // console.log('🚀 ~ returnnewPromise ~ rowsTicketAssign:', rowsTicketAssign);

            let assignUserIds = rowsTicketAssign.rows.map(row => row.assign_userid);
            // console.log('🚀 ~ returnnewPromise ~ assign_userid:', assignUserIds);

            let sqlQueryTag = `INSERT INTO ticket_tags (ticket_tags_tagid,ticket_tags_ticketid, ticket_tags_createdate) VALUES (unnest($1::int[]), $2, $3)`;
            let rowsTag = await client.query(sqlQueryTag, [params[11], ticket_id, ticket_createdate]);
            // console.log('🚀 ~ returnnewPromise ~ rowsTag:', rowsTag);

            let sqlQueryTicketDetail = `
                INSERT INTO ticket_detail (
                    detail_createby, detail_ticketid, detail_type, detail_access,
                    detail_details, detail_createdate
                ) VALUES ($1, $2, 1, 1, $3, $4)`;

            let rowsTicketDetail = await client.query(sqlQueryTicketDetail, [
                params[13],
                ticket_id,
                params[12],
                ticket_createdate,
            ]);

            let sqlQueryTicketStatus = `
                INSERT INTO ticket_status (
                    ticket_status_statusid, ticket_status_ticketid, ticket_status_createdate
                ) VALUES (1, $1, $2)`;

            let rowsTicketStatus = await client.query(sqlQueryTicketStatus, [ticket_id, ticket_createdate]);
            // console.log('🚀 ~ returnnewPromise ~ rowsTicketStatus:', rowsTicketStatus);

            let notifyDetail = `${ticket_title} Ticket code: ${ticket_code}`;
            for (let userId of assignUserIds) {
                // console.log('🚀 ~ returnnewPromise ~ notifyDetail:', notifyDetail);
                let sqlQueryTicketNotifications = `
                    INSERT INTO noti_message (notify_ticketid, notify_userid, notify_status, notify_topic, notify_detail, notify_createdate)
                    VALUES ($1, $2, 0, 'คำสั่ง Ticket ใหม่', $3, $4)`;

                let rowsNotifications = await client.query(sqlQueryTicketNotifications, [
                    ticket_id,
                    userId,
                    notifyDetail,
                    ticket_createdate,
                ]);
                // console.log('🚀 ~ returnnewPromise ~ rowsNotifications:', rowsNotifications);
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

const ViewTicket = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT
            ticket.ticket_id, 
            ticket.ticket_code, 
            ticket.ticket_createdate,
            ticket.ticket_orderdate, 
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_id,
            company.company_fullname,
            company_contact.contact_fullname,
            set_issue.issue_priority, 
            set_issue.issue_duedate, 
            set_issue.issue_type,
            ticket_status.ticket_status_statusid,
            set_team.team_id,
            set_team.team_name,
            COALESCE(
                STRING_AGG(DISTINCT CAST(ticket_assign.assign_userid AS TEXT), ', '), 
                '0'
            ) AS assign_user,
            COALESCE(
                STRING_AGG(DISTINCT CAST(sys_user.user_firstname AS TEXT), ', '), 
                '0'
            ) AS user_assign,
            COALESCE(
                STRING_AGG(DISTINCT CAST(ticket_tags.ticket_tags_tagid AS TEXT), ', '), 
                '0'
            ) AS ticket_tags,
            COALESCE(
                STRING_AGG(DISTINCT CAST(set_tag.tag_name AS TEXT), ', '), 
                '0'
            ) AS tag_names
        FROM
            ticket
        JOIN 
            set_issue ON ticket.ticket_issueid = set_issue.issue_id
        JOIN 
            company ON ticket.ticket_companyid = company.company_id
        JOIN
            company_contact ON ticket.ticket_company_contactid = company_contact.contact_id
        JOIN 
            ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid 
        JOIN 
            set_team ON ticket.ticket_teamid = set_team.team_id
        LEFT JOIN 
            ticket_assign ON ticket.ticket_id = ticket_assign.assign_ticketid
        LEFT JOIN 
            sys_user ON ticket_assign.assign_userid = sys_user.user_id
        LEFT JOIN 
            ticket_tags ON ticket.ticket_id = ticket_tags.ticket_tags_ticketid
        LEFT JOIN 
            set_tag ON ticket_tags.ticket_tags_tagid = set_tag.tag_id
        WHERE 
            ticket.ticket_delete = 0
            AND ticket.ticket_id = $1
        GROUP BY 
            ticket.ticket_id,
            ticket.ticket_code, 
            ticket.ticket_createdate,
            ticket.ticket_orderdate, 
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_id,
            company.company_fullname,
            company_contact.contact_fullname,
            set_issue.issue_priority, 
            set_issue.issue_duedate, 
            set_issue.issue_type,
            ticket_status.ticket_status_statusid,
            set_team.team_id,
            set_team.team_name
        `; 
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        }
    })
}
const listDetail = async function(params) {
    console.log("🚀 ~ listEdit ~ params:", params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT 
                ticket.ticket_id,
                ticket.ticket_code,
                ticket.ticket_title,
                ticket.ticket_createdate,
                ticket_detail.detail_details,
                ticket_detail.detail_createby,
                sys_user.user_firstname AS "use_createby"
            FROM ticket
            JOIN ticket_detail ON ticket.ticket_id = ticket_detail.detail_ticketid
            JOIN sys_user ON ticket_detail.detail_createby = sys_user.user_id
            WHERE ticket.ticket_id = $1 AND ticket.ticket_delete = 0 AND ticket_detail.detail_type = 1
            AND ticket_detail.detail_access = 1`;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};


const addMainNote = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM ticket_detail WHERE detail_ticketid = 1 
            AND detail_access = 1 
            OR detail_access = 0 
            AND detail_type = 1 
            OR detail_type = 2`;
            let rows = await client.query(sqlQuery);
            resolve(rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
}

const listEdit = async function(params) {
    console.log("🚀 ~ listEdit ~ params:", params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT
            ticket.ticket_id,
            ticket.ticket_createdate,
            ticket_status.ticket_status_statusid,
            ticket.ticket_companyid,
            company.company_fullname,
            ticket.ticket_type,
            set_issue.issue_priority,
            STRING_AGG(DISTINCT CAST(ticket_tags.ticket_tags_tagid AS TEXT), ', ') AS ticket_tags,
            set_issue.issue_duedate,
            set_issue.issue_type,
            MAX(ticket_detail.detail_updateby) AS detail_updateby,
            COALESCE(MAX('"' || sys_user.user_firstname || '"'), '""') AS user_updateby,
            STRING_AGG(DISTINCT set_tag.tag_name, ', ') AS tag_names
        FROM
            ticket
        JOIN 
            ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid 
        JOIN 
            ticket_detail ON ticket.ticket_id = ticket_detail.detail_ticketid
        JOIN 
            company ON ticket.ticket_companyid = company.company_id
        JOIN 
            set_issue ON ticket.ticket_issueid = set_issue.issue_id
        LEFT JOIN 
            sys_user ON ticket_detail.detail_updateby = sys_user.user_id
        LEFT JOIN 
            ticket_tags ON ticket.ticket_id = ticket_tags.ticket_tags_ticketid
        LEFT JOIN 
            set_tag ON ticket_tags.ticket_tags_tagid = set_tag.tag_id
        WHERE 
            ticket.ticket_id = $1 
            AND ticket.ticket_delete = 0
        GROUP BY
            ticket.ticket_id,
            ticket.ticket_createdate,
            ticket_status.ticket_status_statusid,
            ticket.ticket_companyid,
            company.company_fullname,
            ticket.ticket_type,
            set_issue.issue_priority,
            set_issue.issue_duedate,
            set_issue.issue_type
        
        `;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const updateTicket = async function(params) {
    console.log("🚀 ~ update ~ params:", params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `UPDATE ticket_status AS ts
            SET ticket_status_statusid = $2
            FROM ticket AS t
            WHERE t.ticket_id = $1
            AND ts.ticket_status_ticketid = t.ticket_id`;
            await client.query(sqlQuery, params);
            resolve("Update successful");
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};


const addNote = async function (params) {
    console.log("🚀 ~ addNote ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `INSERT INTO ticket_detail (detail_ticketid, detail_type, detail_details, detail_access, detail_updateby, detail_createdate)
            VALUES ($1, 2, $2, 0, $3, $4)
            `;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const listEditTeam = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT 
            ticket_id,
            ticket_teamid,
            set_team.team_name,
            COALESCE(STRING_AGG(CAST(ticket_assign.assign_userid AS TEXT), ', '), '0') AS assign_user,
            COALESCE(STRING_AGG(CAST(sys_user.user_firstname AS TEXT), ', '), '0') AS user_assign
        FROM ticket
        JOIN ticket_assign ON ticket.ticket_id = ticket_assign.assign_ticketid
        JOIN sys_user ON ticket_assign.assign_userid = sys_user.user_id
        JOIN set_team ON ticket.ticket_teamid = set_team.team_id
        WHERE 
            ticket.ticket_id = $1 
            AND ticket.ticket_delete = 0
            GROUP BY ticket.ticket_id,
            set_team.team_name
        `;
        let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
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
            let sqlQuery = await client.query(`SELECT 
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



const deleteTicket = async function(params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            let sqlQuery = `UPDATE ticket SET ticket_delete = 1 WHERE ticket_id = $1`;
            let rows = await client.query(sqlQuery, params);
            
            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
}
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

module.exports = { MainTicket, 
    countTicket, 
    addTicket, 
    updateTicket, 
    DataCompany,
    ViewTicket, 
    DatacontactByCompany, 
    listDetail, 
    listEdit, 
    listEditTeam, 
    assignUser, 
    DataNotification, 
    deleteTicket, 
    addNote 
};

