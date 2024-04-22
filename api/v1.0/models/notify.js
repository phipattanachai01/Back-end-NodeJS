var {connection} = require('../../../connection');

// const MainNotification = async function (dataDate) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             let sqlQuery = `SELECT 
//             set_status.status_id,
//             set_status.status_name, 
//             COALESCE(COUNT(ticket_status.ticket_status_statusid), 0) AS status_count
//         FROM 
//             (SELECT 1 AS status_id, 'Open' AS status_name
//              UNION ALL
//              SELECT 2 AS status_id, 'Pending' AS status_name
//              UNION ALL
//              SELECT 3 AS status_id, 'Resolved' AS status_name
//              UNION ALL
//              SELECT 4 AS status_id, 'Waiting On 3rd Party' AS status_name
//              UNION ALL
//              SELECT 5 AS status_id, 'Waiting On Customer' AS status_name
//              UNION ALL
//              SELECT 6 AS status_id, 'Closed' AS status_name) AS set_status
//         LEFT JOIN 
//             ticket_status ON set_status.status_id = ticket_status.ticket_status_statusid
//         GROUP BY 
//             set_status.status_id, set_status.status_name
        
//         UNION ALL
        
//         SELECT 
//             7 AS status_id,
//             'All' AS status_name,
//             SUM(status_count) AS status_count
//         FROM 
//             (SELECT 
//                 set_status.status_id,
//                 COALESCE(COUNT(ticket_status.ticket_status_statusid), 0) AS status_count
//             FROM 
//                 (SELECT 1 AS status_id
//                  UNION ALL
//                  SELECT 2 AS status_id
//                  UNION ALL
//                  SELECT 3 AS status_id
//                  UNION ALL
//                  SELECT 4 AS status_id
//                  UNION ALL
//                  SELECT 5 AS status_id
//                  UNION ALL
//                  SELECT 6 AS status_id) AS set_status
//             LEFT JOIN 
//                 ticket_status ON set_status.status_id = ticket_status.ticket_status_statusid
//             GROUP BY 
//                 set_status.status_id) AS all_status
//         ORDER BY
//             status_id`;
//             if (dataDate && dataDate !== null) {
//                 sqlQuery += `
//                     WHERE DATE(ticket_status.ticket_status_createdate) >= $1 
//                     AND DATE(ticket_status.ticket_status_createdate) <= $2
//                     ORDER BY ticket_status.ticket_status_createdate
//                 `;
//                 let rows = await client.query(sqlQuery, dataDate);
//                 resolve(rows.rows);
//             }
//             let rows = await client.query(sqlQuery);
//             console.log(rows.rows);
//             resolve(rows.rows);
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     })
// };


const MainNotification = async function (dataDate) {
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
             SELECT 4 AS status_id, 'Waiting On 3rd Party' AS status_name
             UNION ALL
             SELECT 5 AS status_id, 'Waiting On Customer' AS status_name
             UNION ALL
             SELECT 6 AS status_id, 'Closed' AS status_name) AS set_status
        LEFT JOIN 
            ticket_status ON set_status.status_id = ticket_status.ticket_status_statusid`;

            if (dataDate && dataDate !== null) {
                sqlQuery += `
                    AND (DATE(ticket_status.ticket_status_createdate) >= $1 
                    AND DATE(ticket_status.ticket_status_createdate) <= $2
                    OR ticket_status.ticket_status_createdate IS NULL)
                `;
            }

            sqlQuery += `
                GROUP BY 
                    set_status.status_id, set_status.status_name
                
                UNION ALL
                
                SELECT 
                    7 AS status_id,
                    'All' AS status_name,
                    SUM(status_count) AS status_count
                FROM 
                    (SELECT 
                        set_status.status_id,
                        COALESCE(COUNT(ticket_status.ticket_status_statusid), 0) AS status_count
                    FROM 
                        (SELECT 1 AS status_id
                         UNION ALL
                         SELECT 2 AS status_id
                         UNION ALL
                         SELECT 3 AS status_id
                         UNION ALL
                         SELECT 4 AS status_id
                         UNION ALL
                         SELECT 5 AS status_id
                         UNION ALL
                         SELECT 6 AS status_id) AS set_status
                    LEFT JOIN 
                        ticket_status ON set_status.status_id = ticket_status.ticket_status_statusid`;

            if (dataDate && dataDate !== null) {
                sqlQuery += `
                    AND (DATE(ticket_status.ticket_status_createdate) >= $1 
                    AND DATE(ticket_status.ticket_status_createdate) <= $2
                    OR ticket_status.ticket_status_createdate IS NULL)
                `;
            }

            sqlQuery += `
                    GROUP BY 
                        set_status.status_id) AS all_status
                ORDER BY
                    status_id`;

            let rows;
            if (dataDate && dataDate !== null) {
                rows = await client.query(sqlQuery, dataDate);
            } else {
                rows = await client.query(sqlQuery);
            }

            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    })
};


const listnoti = async function (param) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT notify_id, notify_topic, notify_detail FROM noti_message WHERE notify_userid = $1`;
            let rows = await client.query(sqlQuery , param);
            console.log("🚀 ~ returnnewPromise ~ rows:", rows.rows)
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
}

const updateStatusNoti = async function (param) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `UPDATE noti_message SET notify_status = $1 WHERE notify_id = $2`;
            let rows = await client.query(sqlQuery , param);
            // console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
}

module.exports = { MainNotification, listnoti, updateStatusNoti}