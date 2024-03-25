var {connection} = require('../../../connection')

const MainNotification = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT 
            set_status.status_id,
            set_status.status_name, 
            COALESCE(COUNT(ticket_status.ticket_status_statusid), 0) AS status_count
        FROM 
            (SELECT 1 AS status_id, 'Open' AS status_name
             UNION ALL
             SELECT 2 AS status_id, 'Pending' AS status_name
             UNION ALL
             SELECT 3 AS status_id, 'Resolved' AS status_name
             UNION ALL
             SELECT 4 AS status_id, 'Waiting on 3rd Party' AS status_name
             UNION ALL
             SELECT 5 AS status_id, 'Waiting On Customer' AS status_name
             UNION ALL
             SELECT 6 AS status_id, 'Closed' AS status_name) AS set_status
        LEFT JOIN 
            ticket_status ON set_status.status_id = ticket_status.ticket_status_statusid
        LEFT JOIN 
            (SELECT ticket_status_ticketid, COUNT(ticket_status_statusid) AS total_status_count 
             FROM ticket_status 
             GROUP BY ticket_status_ticketid) AS total 
             ON total.ticket_status_ticketid = ticket_status.ticket_status_ticketid
        GROUP BY 
            set_status.status_id, set_status.status_name
        ORDER BY 
            set_status.status_id;
        `;
            let rows = await client.query(sqlQuery);
            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        }
    })
};
module.exports = { MainNotification }