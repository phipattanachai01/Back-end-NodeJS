var { connection } = require('../../../connection');

const MainTeam = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT 
            set_team.team_id AS teamId,
            set_team.team_name,
            COALESCE(STRING_AGG(sys_user.user_firstname, ', '), '0') AS user_firstname,
            COUNT(set_team_user.team_user_userid) AS number_of_people
            FROM 
            set_team
            LEFT JOIN 
            set_team_user ON set_team.team_id = set_team_user.team_user_teamid
            LEFT JOIN 
            sys_user ON set_team_user.team_user_userid = sys_user.user_id
            GROUP BY 
            set_team.team_id, set_team.team_name
            ORDER BY 
            set_team.team_id`;
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

// const Addteam = function (data) {
//     console.log("🚀 ~ Addteam ~ data:", [data.teamName, data.formattedDateTime])
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             // const { teamName, userFirstNames , formattedDateTime } = data;
//             const teamInsertQuery = `INSERT INTO set_team (team_name , team_createdate) VALUES ($1,$2) RETURNING team_id`;
//             const teamResult = await client.query(teamInsertQuery, [data.teamName, data.formattedDateTime]);
//             console.log("🚀 ~ returnnewPromise ~ teamResult:", teamResult)
//             const teamId = teamResult.rows[0].team_id;
//             console.log("🚀 ~ returnnewPromise ~ teamId:", teamId)
            
//             const userInsertQuery = `
//         INSERT INTO set_team_user (team_user_teamid, team_user_userid, team_user_createdate)
//         SELECT $1, user_id, $2
//         FROM sys_user
//         WHERE user_firstname = ANY($3)`;
//         await client.query(userInsertQuery, [teamId, data.formattedDateTime, data.userFirstNames]);

//             resolve({ teamId });
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };
const Addteam = function (data) {
    // console.log("🚀 ~ Addteam ~ data:", [data.teamName, data]);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            const teamInsertQuery = `
                INSERT INTO set_team (team_name, team_createdate, team_status) 
                VALUES ($1, $2, 1) 
                RETURNING team_id`;
            const teamResult = await client.query(teamInsertQuery, [data.teamName, data.formattedDateTime]);
            const teamId = teamResult.rows[0].team_id;

            const userInsertQuery = `
                INSERT INTO set_team_user (team_user_teamid, team_user_userid, team_user_createdate)
                SELECT $1, user_id, $2 
                FROM sys_user
                WHERE user_firstname = ANY($3)`;
            await client.query(userInsertQuery, [teamId, data.formattedDateTime, data.userFirstNames]);

            await client.query('COMMIT');

            resolve({ teamId });
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.error(error);
        } finally {
            client.release();
        }
    });
};


const EditTeam = function (data, teamId, formattedDateTime) {
    // console.log("🚀 ~ EditTeam ~ teamId:", teamId)
    // console.log("🚀 ~ EditTeam ~ data:", data)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            // const { teamId, teamName, userFirstNames } = data;

            var updateTeamQuery = `UPDATE set_team SET team_name = $1 , team_updatedate = $2 WHERE team_id = $3`;
            await client.query(updateTeamQuery, [data.teamName, formattedDateTime, teamId]);

            var updateMembersQuery = `
                UPDATE set_team_user 
                SET team_user_teamid = $1,
                    team_user_updatedate = $2
                WHERE team_user_teamid = $3 AND team_user_userid IN (
                    SELECT user_id
                    FROM sys_user
                    WHERE user_firstname = ANY($4)
                )
            `;
            await client.query(updateMembersQuery, [teamId, formattedDateTime, teamId, data.userFirstNames]);

            resolve({ teamId });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const DeleteTeam = function (teamId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var deleteTeamQuery = `DELETE FROM set_team WHERE team_id = $1`;
            await client.query(deleteTeamQuery, [teamId]);
            
            
            var deleteTeamUsersQuery = `DELETE FROM set_team_user WHERE team_user_teamid = $1`;
            await client.query(deleteTeamUsersQuery, [teamId]);
            
            resolve({ teamId });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const ReorganizeTeamIDs = function (deletedTeamId, teamId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var reorganizeTeamQuery = `
                UPDATE set_team
                SET team_id = team_id - 1
                WHERE team_id > $1
            `;
            await client.query(reorganizeTeamQuery, [deletedTeamId]);

            var reorganizeTeamUsersQuery = `
                UPDATE set_team_user
                SET team_user_teamid = set_team.team_id
                FROM set_team
                WHERE set_team_user.team_user_teamid > $1
                AND set_team_user.team_user_teamid = set_team.team_id + 1
            `;
            await client.query(reorganizeTeamUsersQuery, [deletedTeamId]);

            resolve();
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const statusTeam = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            var statusTeamQuery = `
                UPDATE set_team
                SET team_status = $1
                WHERE team_id = $2
            `;
            await client.query(statusTeamQuery, params);
            await client.query('COMMIT');

            resolve();
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
}

const checkByTeam = function (CheckTeam) {
    console.log('🚀 ~ checkEmailByContact ~ contactemail:', CheckTeam);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT * FROM set_team WHERE team_name = $1`;
            let rows = await client.query(sqlQuery, [CheckTeam]);
            resolve(rows.rows.length > 0);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};



module.exports = { MainTeam, Addteam, EditTeam, DeleteTeam , ReorganizeTeamIDs, statusTeam, checkByTeam};


