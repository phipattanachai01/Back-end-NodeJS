const { generateTicketCode } = require('../middleware/formatConverter');
const { connection } = require('../../../connection');
const { Connection } = require('pg');

// const MainTicket = async function (params, userId) {
//     console.log("🚀 ~ MainTicket ~ userId:", userId)
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             let sqlQuery = `SELECT
//             ticket.ticket_id,
//             ticket.ticket_code,
//             ticket.ticket_orderdate,
//             ticket.ticket_type,
//             ticket.ticket_title,
//             company.company_id,
//             company.company_shortname,
//             company.company_fullname,
//             company_contact.contact_nickname,
//             set_issue.issue_priority,
//             set_issue.issue_duedate,
//             set_issue.issue_type,
//             ticket_status.ticket_status_statusid,
//             set_team.team_name
//         FROM
//             ticket
//         JOIN
//             set_issue ON ticket.ticket_issueid = set_issue.issue_id
//         JOIN
//             company ON ticket.ticket_companyid = company.company_id
//         JOIN
//             company_contact ON ticket.ticket_company_contactid = company_contact.contact_id
//         JOIN
//             ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid
//         JOIN
//             set_team ON ticket.ticket_teamid = set_team.team_id
//         JOIN
//             ticket_detail ON ticket.ticket_id = ticket_detail.detail_ticketid
//         JOIN
//             ticket_assign ON ticket_assign.assign_ticketid = ticket.ticket_id
//         JOIN
//             sys_user ON ticket_assign.assign_userid = sys_user.user_id

//             WHERE ticket.ticket_delete = 0
// GROUP BY
//     ticket.ticket_id,
//     ticket.ticket_code,
//     ticket.ticket_orderdate,
//     ticket.ticket_type,
//     ticket.ticket_title,
//     company.company_id,
//     company.company_shortname,
//     company.company_fullname,
//     company_contact.contact_nickname,
//     set_issue.issue_priority,
//     set_issue.issue_duedate,
//     set_issue.issue_type,
//     ticket_status.ticket_status_statusid,
//     set_team.team_name
//             `;
//             if (params && params.user_id !== undefined && params.user_id !== 1) {
//                 console.log("🚀 ~ returnnewPromise ~ params:", params.userid)
//                 sqlQuery += ` AND sys_user.user_id = $1`;
//                 let rows = await client.query(sqlQuery, userId);
//                 resolve(rows.rows);
//             }
// if (params && params.company_id !== undefined) {

//     sqlQuery += ` AND ticket.ticket_companyid = $1`;

//     sqlQuery += ` ORDER BY ticket.ticket_id`;
//     let rows = await client.query(sqlQuery, params);
//     resolve(rows.rows);
// } else {
//                 sqlQuery += ` ORDER BY ticket.ticket_id`;
//                 let rows = await client.query(sqlQuery);
//                 resolve(rows.rows);
//             }
//         } catch (error) {
//             await client.query('ROLLBACK');
//             reject(error);
//         } finally {
//             client.release();
//         }
//     });
// };

const MainTicket = async function (params, userId, role, dataDate) {
    // console.log("🚀 ~ MainTicket ~ dataDate:", dataDate)
    // console.log("🚀 ~ MainTicket ~ params:", params)
    // console.log("🚀 ~ MainTicket ~ userId:", userId)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `
                SELECT 
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
                JOIN
                    ticket_assign ON ticket_assign.assign_ticketid = ticket.ticket_id
                JOIN
                    sys_user ON ticket_assign.assign_userid = sys_user.user_id
                WHERE 
                    ticket.ticket_delete = 0
            `;
            if (dataDate && dataDate !== null) {
                sqlQuery += `
                    AND DATE(ticket.ticket_createdate) >= $1 
                    AND DATE(ticket.ticket_createdate) <= $2
                    ORDER BY ticket.ticket_createdate
                `;
                let rows = await client.query(sqlQuery, dataDate);
                resolve(rows.rows);
            }

            if (params && params !== undefined) {
                sqlQuery += ` AND ticket.ticket_companyid = $1`;
                sqlQuery += ` GROUP BY ticket.ticket_id,
                company.company_id,
                company_contact.contact_nickname,
                set_issue.issue_priority,
                set_issue.issue_duedate,
                 set_issue.issue_type,
                ticket_status.ticket_status_statusid,
                set_team.team_name`;
                let rows = await client.query(sqlQuery, params);
                resolve(rows.rows);
            } else {
                if (role && role == 1) {
                    sqlQuery += `
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
                        ORDER BY ticket.ticket_id
                    `;
                    let rows = await client.query(sqlQuery);
                    resolve(rows.rows);
                } else {
                    if (userId && userId !== 0) {
                        sqlQuery += ` AND sys_user.user_id = $1
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
                        sqlQuery += ` ORDER BY ticket.ticket_id`;
                        let rows = await client.query(sqlQuery, [userId]);
                        resolve(rows.rows);
                    } else {
                        reject('Invalid userId');
                    }
                }
            }

            if (dataDate && dataDate !== 0) {
                sqlQuery += `
                    AND DATE(ticket.ticket_createdate) >= $1 
                    AND DATE(ticket.ticket_createdate) <= $2
                    ORDER BY ticket.ticket_createdate
                `;
                let rows = await client.query(sqlQuery, dataDate);
                resolve(rows.rows);
            }
            // if (dataDate && dataDate !== 0) {
            //     sqlQuery += `
            //     AND DATE(ticket.ticket_createdate) >= $1
            //     AND DATE(ticket.ticket_createdate) <= $2
            //     `;
            // sqlQuery += ` ORDER BY ticket.ticket_createdate
            // GROUP BY
            //             ticket.ticket_id,
            //             ticket.ticket_code,
            //             ticket.ticket_orderdate,
            //             ticket.ticket_type,
            //             ticket.ticket_title,
            //             company.company_id,
            //             company.company_shortname,
            //             company.company_fullname,
            //             company_contact.contact_nickname,
            //             set_issue.issue_priority,
            //             set_issue.issue_duedate,
            //             set_issue.issue_type,
            //             ticket_status.ticket_status_statusid,
            //             set_team.team_name`;
            // }

            // if (role && role == 1) {
            //     sqlQuery += `
            //         GROUP BY
            //             ticket.ticket_id,
            //             ticket.ticket_code,
            //             ticket.ticket_orderdate,
            //             ticket.ticket_type,
            //             ticket.ticket_title,
            //             company.company_id,
            //             company.company_shortname,
            //             company.company_fullname,
            //             company_contact.contact_nickname,
            //             set_issue.issue_priority,
            //             set_issue.issue_duedate,
            //             set_issue.issue_type,
            //             ticket_status.ticket_status_statusid,
            //             set_team.team_name
            //         ORDER BY ticket.ticket_id
            //     `;
            //     let rows = await client.query(sqlQuery);
            //     resolve(rows.rows);
            // } else {
            //     if (userId && userId !== 0) {
            //         sqlQuery += ` AND sys_user.user_id = $1
            //         GROUP BY
            //             ticket.ticket_id,
            //             ticket.ticket_code,
            //             ticket.ticket_orderdate,
            //             ticket.ticket_type,
            //             ticket.ticket_title,
            //             company.company_id,
            //             company.company_shortname,
            //             company.company_fullname,
            //             company_contact.contact_nickname,
            //             set_issue.issue_priority,
            //             set_issue.issue_duedate,
            //             set_issue.issue_type,
            //             ticket_status.ticket_status_statusid,
            //             set_team.team_name
            //         `;
            //         let rows = await client.query(sqlQuery, [userId]);
            //         resolve(rows.rows);
            //     } else {
            //         reject("Invalid userId");
            //     }
            // }
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

// const MainTicket = async function (params, userId) {
//     console.log("🚀 ~ MainTicket ~ userId:", userId)
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             let sqlQuery;
//             let queryParams = [];
//             if (userId && userId !== undefined && userId !== 1) {
//                 sqlQuery = `SELECT
//                     ticket.ticket_id,
//                     ticket.ticket_code,
//                     ticket.ticket_orderdate,
//                     ticket.ticket_type,
//                     ticket.ticket_title,
//                     company.company_id,
//                     company.company_shortname,
//                     company.company_fullname,
//                     company_contact.contact_nickname,
//                     set_issue.issue_priority,
//                     set_issue.issue_duedate,
//                     set_issue.issue_type,
//                     ticket_status.ticket_status_statusid,
//                     set_team.team_name
//                 FROM
//                     ticket
//                 JOIN
//                     set_issue ON ticket.ticket_issueid = set_issue.issue_id
//                 JOIN
//                     company ON ticket.ticket_companyid = company.company_id
//                 JOIN
//                     company_contact ON ticket.ticket_company_contactid = company_contact.contact_id
//                 JOIN
//                     ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid
//                 JOIN
//                     set_team ON ticket.ticket_teamid = set_team.team_id
//                 JOIN
//                     ticket_detail ON ticket.ticket_id = ticket_detail.detail_ticketid
//                 JOIN
//                     ticket_assign ON ticket_assign.assign_ticketid = ticket.ticket_id
//                 JOIN
//                     sys_user ON ticket_assign.assign_userid = sys_user.user_id
//                 WHERE ticket.ticket_delete = 0
//                 AND sys_user.user_id = $1
//                 GROUP BY
//                     ticket.ticket_id,
//                     ticket.ticket_code,
//                     ticket.ticket_orderdate,
//                     ticket.ticket_type,
//                     ticket.ticket_title,
//                     company.company_id,
//                     company.company_shortname,
//                     company.company_fullname,
//                     company_contact.contact_nickname,
//                     set_issue.issue_priority,
//                     set_issue.issue_duedate,
//                     set_issue.issue_type,
//                     ticket_status.ticket_status_statusid,
//                     set_team.team_name`;
//                 queryParams.push(userId);
//             } else {
//                 sqlQuery = `SELECT DISTINCT
//                     ticket.ticket_id,
//                     ticket.ticket_code,
//                     ticket.ticket_orderdate,
//                     ticket.ticket_type,
//                     ticket.ticket_title,
//                     company.company_id,
//                     company.company_shortname,
//                     company.company_fullname,
//                     company_contact.contact_nickname,
//                     set_issue.issue_priority,
//                     set_issue.issue_duedate,
//                     set_issue.issue_type,
//                     ticket_status.ticket_status_statusid,
//                     set_team.team_name
//                 FROM
//                     ticket
//                 JOIN
//                     set_issue ON ticket.ticket_issueid = set_issue.issue_id
//                 JOIN
//                     company ON ticket.ticket_companyid = company.company_id
//                 JOIN
//                     company_contact ON ticket.ticket_company_contactid = company_contact.contact_id
//                 JOIN
//                     ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid
//                 JOIN
//                     set_team ON ticket.ticket_teamid = set_team.team_id
//                 JOIN
//                     ticket_detail ON ticket.ticket_id = ticket_detail.detail_ticketid
//                 JOIN
//                     ticket_assign ON ticket_assign.assign_ticketid = ticket.ticket_id
//                 JOIN
//                     sys_user ON ticket_assign.assign_userid = sys_user.user_id
//                 WHERE ticket.ticket_delete = 0
//                 ORDER BY ticket.ticket_id
//                 `;
//             };
//             let rows = await client.query(sqlQuery, queryParams);
//             resolve(rows.rows);
//         } catch (error) {
//             await client.query('ROLLBACK');
//             reject(error);
//         } finally {
//             client.release();
//         }
//     });
// };

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
};

const addTicket = async function (params, filesParams) {
    // console.log('🚀 ~ addTicket ~ filesParams:', filesParams);
    // console.log('🚀 ~ addTicket ~ params 0:', params[0]);
    // console.log('🚀 ~ addTicket ~ params 1:', params[1]);
    // console.log('🚀 ~ addTicket ~ params 2:', params[2]);
    // console.log('🚀 ~ addTicket ~ params 3:', params[3]);
    // console.log('🚀 ~ addTicket ~ params 4:', params[4]);
    // console.log('🚀 ~ addTicket ~ params 5:', params[5]);
    // console.log('🚀 ~ addTicket ~ params 6:', params[6]);
    // console.log('🚀 ~ addTicket ~ params 7:', params[7]);
    // console.log('🚀 ~ addTicket ~ params 8:', params[8]);
    // console.log('🚀 ~ addTicket ~ params 9:', params[9]);
    // console.log('🚀 ~ addTicket ~ params 10:', params[10]);
    // console.log('🚀 ~ addTicket ~ params 11:', params[11]);
    // console.log('🚀 ~ addTicket ~ params 12:', params[12]);
    // console.log('🚀 ~ addTicket ~ params 13:', params[13]);
    // console.log('🚀 ~ addTicket ~ params 14:', params[14]);
    // console.log('🚀 ~ addTicket ~ params 15:', params[15]);
    // console.log('🚀 ~ addTicket ~ params 16:', params[16]);
    // console.log('🚀 ~ addTicket ~ params 17:', params[17]);
    // console.log('🚀 ~ addTicket ~ params 18:', params[18]);
    // console.log('🚀 ~ addTicket ~ params 19:', params[19]);
    // console.log('🚀 ~ addTicket ~ params 20:', params[20]);

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
            RETURNING ticket_id,  ticket_createdate , ticket_teamid , ticket_code , ticket_title , ticket_notification_status`;

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
            let ticket_notification_status = ticketRows.rows[0].ticket_notification_status;

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
                    detail_details, detail_createdate, detail_delete
                ) VALUES ($1, $2, 1, 1, $3, $4, 0) RETURNING detail_id , detail_createby`;

            let rowsTicketDetail = await client.query(sqlQueryTicketDetail, [
                params[13],
                ticket_id,
                params[12],
                ticket_createdate,
            ]);
            let detail_id = rowsTicketDetail.rows[0].detail_id;
            // console.log('🚀 ~ returnnewPromise ~ detail_id:', detail_id);
            let detail_createby = rowsTicketDetail.rows[0].detail_createby;
            console.log("🚀 ~ returnnewPromise ~ detail_createby:", detail_createby)
            let sqlQueryTicketFile = `
            INSERT INTO ticket_file 
                (file_name, file_size, file_type, file_extension,
                     file_detailid, file_createdate, file_url, file_path, file_delete)
             VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, 0)`;
            // console.log('🚀 ~ returnnewPromise ~ params:', params.slice(14, 18));
            // params[15] = Math.round(parseFloat(params[15]))
            for (let fileParams of filesParams) {
                let fileRow = await client.query(sqlQueryTicketFile, [
                    fileParams[0], // file_name
                    fileParams[1], // file_size
                    fileParams[2], // file_type
                    fileParams[3], // file_extension
                    detail_id, // file_detailid
                    ticket_createdate, // file_createdate
                    fileParams[4], // file_url
                    fileParams[5], // file_path
                ]);
            }

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
            };

            let sqlQuerylineNotifications = `SELECT set_team.team_linetoken 
            FROM set_team 
            JOIN ticket ON set_team.team_id = ticket.ticket_teamid 
            WHERE ticket.ticket_id = $1`;
            let rowslineNotifications = await client.query(sqlQuerylineNotifications, [ticket_id]);
            let sqlQueryStatusTicket = `SELECT set_status.status_name 
            FROM set_status 
            JOIN ticket_status ON set_status.status_id = ticket_status.ticket_status_statusid 
            JOIN ticket ON ticket.ticket_id = ticket_status.ticket_status_ticketid 
            WHERE ticket.ticket_id = $1;
            `;
            let rowsStatusTicket = await client.query(sqlQueryStatusTicket, [ticket_id]);

            let sqlQueryUsers = `SELECT user_firstname FROM sys_user WHERE user_id = $1 AND user_delete = 0 `
            let rowsUsers = await client.query(sqlQueryUsers, [detail_createby]);
            let user_createby = rowsUsers.rows[0].user_firstname;
            console.log("🚀 ~ returnnewPromise ~ user_createby:", user_createby)
            console.log("🚀 ~ returnnewPromise ~ user_createby:", user_createby)
            await client.query('COMMIT');
            resolve({
                ticket_id: ticket_id,
                ticket_code: ticket_code,
                ticket_title: ticket_title,
                ticket_createdate: ticket_createdate,
                detail_id: detail_id,
                assignUserIds: assignUserIds,
                ticket_notification_status: ticket_notification_status,
                lineNotifications: rowslineNotifications.rows[0],
                rowsStatusTicket: rowsStatusTicket.rows[0],
                user_createby: user_createby
            });
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
            ticket.ticket_cc,
            ticket.ticket_notification_status,
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_id,
            company.company_fullname,
            company_contact.contact_fullname,
            set_issue.issue_id,
            set_issue.issue_name,
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
            ) AS tag_names,
            COALESCE(
                STRING_AGG(DISTINCT CAST(set_tag.tag_color AS TEXT), ', '), 
                '0'
            ) AS tag_colors,
            ticket_detail.detail_id,
            ticket_detail.detail_details
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
            AND ticket_detail.detail_type = 1
        GROUP BY 
            ticket.ticket_id,
            ticket.ticket_code, 
            ticket.ticket_createdate,
            ticket.ticket_orderdate,
            ticket.ticket_cc,
            ticket.ticket_notification_status,
            ticket.ticket_type, 
            ticket.ticket_title,
            company.company_id,
            company.company_fullname,
            company_contact.contact_fullname,
            set_issue.issue_id,
            set_issue.issue_name,
            set_issue.issue_priority, 
            set_issue.issue_duedate, 
            set_issue.issue_type,
            ticket_status.ticket_status_statusid,
            set_team.team_id,
            set_team.team_name,
            ticket_detail.detail_id,
            ticket_detail.detail_details
        `;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        }
    });
};
const listDetail = async function (params) {
    console.log('🚀 ~ listEdit ~ params:', params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT 
            ticket_detail.detail_id,
	        ticket_detail.detail_type,
	        ticket_detail.detail_access,
            ticket.ticket_id,
            ticket.ticket_code,
            ticket.ticket_title,
            ticket_detail.detail_id,
            ticket_detail.detail_details,
            ticket_detail.detail_createdate,
            ticket_detail.detail_updatedate,
            ticket.ticket_createdate,
            ticket_detail.detail_createby,
            sys_user.user_firstname AS "use_createby"
            FROM ticket_detail
            JOIN ticket ON ticket_detail.detail_ticketid = ticket.ticket_id
            JOIN sys_user ON ticket_detail.detail_createby = sys_user.user_id
            WHERE detail_ticketid = $1 
            AND (detail_access = 1 OR (detail_owner = $2 AND detail_access = 0))
            AND (detail_type <> 2 OR (detail_type = 2 AND detail_delete = 0))
            ORDER BY ticket_detail.detail_createdate
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

const detailFiles = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT
            ticket_file.file_id,
            ticket_file.file_detailid,
            ticket_file.file_type,
            ticket_file.file_path,
            ticket_file.file_url,
            ticket_file.file_name,
            ticket_file.file_extension
        FROM
            ticket_file
        JOIN
            ticket_detail ON ticket_file.file_detailid = ticket_detail.detail_id
        WHERE
            detail_ticketid = $1 
        AND ticket_file.file_delete = 0`;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const MainNote = async function (params, token) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `
            SELECT ticket.ticket_id,
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
            AND ticket_detail.detail_access = 1 
            AND (detail_access = 1 OR detail_owner = $2 AND detail_access = 0) 
            ORDER BY ticket_detail.detail_createdate            
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
const listEdit = async function (params) {
    console.log('🚀 ~ listEdit ~ params:', params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT
            ticket.ticket_id,
            ticket.ticket_createdate,
            ticket_status.ticket_status_statusid,
            ticket_status.ticket_status_updatedate,
            ticket.ticket_companyid,
            company.company_fullname,
            ticket.ticket_type,
            set_issue.issue_priority,
            STRING_AGG(DISTINCT CAST(ticket_tags.ticket_tags_tagid AS TEXT), ', ') AS ticket_tags,
            set_issue.issue_duedate,
            set_issue.issue_type,
            MAX(ticket_detail.detail_updateby) AS detail_updateby,
            COALESCE(MAX('"' || sys_user.user_firstname || '"'), '""') AS user_updateby,
            STRING_AGG(DISTINCT set_tag.tag_name, ', ') AS tag_name,
            STRING_AGG(DISTINCT set_tag.tag_color, ', ') AS tag_color
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
            ticket_status.ticket_status_updatedate,
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

const updateTicket = async function (params) {
    console.log('🚀 ~ update ~ params:', params);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `UPDATE ticket_status AS ts
            SET ticket_status_statusid = $2 , ticket_status_updatedate = $3 ,ticket_status_updateby = $4 
            FROM ticket AS t
            WHERE t.ticket_id = $1
            AND ts.ticket_status_ticketid = t.ticket_id
            RETURNING t.ticket_id`;
            let rowsTicket = await client.query(sqlQuery, params);

            let ticket_id = rowsTicket.rows[0].ticket_id;
            console.log("🚀 ~ returnnewPromise ~ ticket_id:", ticket_id)

            let sqlQueryTicket = `SELECT ticket.ticket_id,
            ticket.ticket_code,
            ticket_status.ticket_status_updatedate,
            ticket.ticket_title,
            set_status.status_name,
            sys_user.user_firstname,
            ticket.ticket_notification_status,
            set_team.team_linetoken
            FROM ticket
            LEFT JOIN ticket_status ON ticket.ticket_id = ticket_status.ticket_status_ticketid
            LEFT JOIN set_status ON set_status.status_id = ticket_status.ticket_status_statusid
            LEFT JOIN sys_user ON ticket_status.ticket_status_updateby = sys_user.user_id
            LEFT JOIN set_team ON ticket.ticket_teamid = set_team.team_id
            WHERE ticket.ticket_id = $1`;
            let rows = await client.query(sqlQueryTicket, [ticket_id]);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const addNote = async function (params, filesParams) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuerydetail = `
            INSERT INTO ticket_detail (
                detail_ticketid, 
                detail_type, 
                detail_details, 
                detail_access, 
                detail_owner, 
                detail_createby, 
                detail_createdate, 
                detail_delete
            )
            VALUES ($1, 2, $2, $3, $4, $4, $5, 0) RETURNING detail_id`;
            let rows = await client.query(sqlQuerydetail, params);

            let detail_id = rows.rows[0].detail_id;
            console.log('🚀 ~ returnnewPromise ~ detail_id:', detail_id);

            let sqlQueryTicketFile = `
            INSERT INTO ticket_file 
                (file_name, file_size, file_type, file_extension,
                     file_detailid, file_createdate, file_url, file_path, file_delete)
             VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, 0)`;
            for (let fileParams of filesParams) {
                let fileRow = await client.query(sqlQueryTicketFile, [
                    fileParams[0], // file_name
                    fileParams[1], // file_size
                    fileParams[2], // file_type
                    fileParams[3], // file_extension
                    detail_id, // file_detailid
                    fileParams[6], // file_createdate
                    fileParams[4], // file_url
                    fileParams[5], // file_path
                ]);
            }
            // if (filesParams !== null) {
            //     console.log("🚀 ~ returnnewPromise ~ filesParams:", filesParams)
            //     let sqlQuery = `
            //         INSERT INTO ticket_detail (
            //             detail_file_name,
            //             detail_file_size,
            //             detail_file_type,
            //             detail_file_extension,
            //             detail_file_url,
            //             detail_file_path,
            //             detail_file_createdate,
            //             detail_file_id
            //         )
            //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            //     for (let fileParams of filesParams) {
            //         await client.query(sqlQuery,
            //             [
            //             filesParams[0],
            //             filesParams[1],
            //             filesParams[2],
            //             filesParams[3],
            //             filesParams[4],
            //             filesParams[5],
            //             filesParams[6],
            //             detail_id
            //         ]);
            // }
            // }
            resolve('Successfully');
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
        FROM company
        WHERE 
                company_delete = 0
            AND company_status = 1`);
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

const deleteTicket = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            let sqlQuery = `UPDATE ticket SET ticket_delete = 1 WHERE ticket_id = $1`;
            let rows = await client.query(sqlQuery, params);

            await client.query('COMMIT');
            resolve('Delete Successfully');
        } catch (error) {
            await client.query('ROLLBACK');
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

const tagTicket = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            let sqlQuery = `SELECT DISTINCT * FROM set_tag WHERE tag_delete = 0 ORDER BY tag_id ASC`;
            let rows = await client.query(sqlQuery);

            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const updateNote = async function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            let sqlQuery = `UPDATE ticket_detail SET detail_details = $2 , detail_updatedate = $3 WHERE detail_id = $1`;
            let rows = await client.query(sqlQuery, data);

            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const deleteNote = async function (data) {
    console.log('🚀 ~ deleteNote ~ data:', data);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            let sqlQuery = `UPDATE ticket_detail SET detail_delete = 1 WHERE detail_id = $1`;
            let rows = await client.query(sqlQuery, data);

            await client.query('COMMIT');
            resolve(rows.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};
const Finddate = async function (dataDate) {
    console.log('🚀 ~ Finddate ~ dataDate:', dataDate);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT DISTINCT
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
            set_team.team_name,
            ticket.ticket_createdate
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
        JOIN
            ticket_assign ON ticket_assign.assign_ticketid = ticket.ticket_id
        JOIN
            sys_user ON ticket_assign.assign_userid = sys_user.user_id
        WHERE 
            ticket.ticket_delete = 0
            AND DATE(ticket.ticket_createdate) >= $1 
            AND DATE(ticket.ticket_createdate) <= $2
        ORDER BY 
            ticket.ticket_createdate
            `;
            let rows = await client.query(sqlQuery, dataDate);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const listfile = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM ticket_file JOIN ticket_detail ON ticket_file.file_detailid = ticket_detail.detail_id WHERE detail_id = $1`;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
};

const countstatusTicket = async function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT 
            ticket_status_statusid,
            COUNT(*) AS count_status,
            (SELECT 
                 COUNT(*) 
             FROM 
                 ticket_status 
             WHERE 
                 ticket_status_statusid BETWEEN 1 AND 6
            ) AS All_status
        FROM 
            ticket_status
        WHERE 
            ticket_status_statusid BETWEEN 1 AND 6
        GROUP BY 
            ticket_status_statusid
        ORDER BY 
            ticket_status_statusid;
        `;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    });
}

module.exports = {
    MainTicket,
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
    addNote,
    deleteNote,
    MainNote, // Test
    updateNote,
    Finddate,
    tagTicket,
    listfile,
    detailFiles,
    countstatusTicket
};
