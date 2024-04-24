const { connection } = require('../../../connection');

const lineNoti = async function (params) {


    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            // var updatesqlQuery = `UPDATE ticket SET ticket_notification_status = 1 WHERE ticket_id = $1`;
            // await client.query(updatesqlQuery, [ticketId]);

            var sqlQuery = `SELECT set_team.team_linetoken, ticket.ticket_notification_status 
            FROM set_team 
            JOIN ticket ON set_team.team_id = ticket.ticket_teamid 
            WHERE ticket.ticket_id = $1;
            `;
            let rows = await client.query(sqlQuery, params);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

module.exports = {
    lineNoti
};
