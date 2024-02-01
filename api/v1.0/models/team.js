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

const Addteam = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            const { teamName, userFirstNames } = data;
            const teamInsertQuery = `INSERT INTO set_team (team_name) VALUES ($1) RETURNING team_id`;
            const teamResult = await client.query(teamInsertQuery, [teamName]);
            const teamId = teamResult.rows[0].team_id;
            const userInsertQuery = `
                INSERT INTO set_team_user (team_user_teamid, team_user_userid)
                SELECT $1, user_id
                FROM sys_user
                WHERE user_firstname = ANY($2)
            `;
            await client.query(userInsertQuery, [teamId, userFirstNames]);

            resolve({ teamId });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const EditTeam = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            const { teamId, teamName, userFirstNames } = data;

            const updateTeamQuery = `UPDATE set_team SET team_name = $1 WHERE team_id = $2`;
            await client.query(updateTeamQuery, [teamName, teamId]);

            const deleteMembersQuery = `DELETE FROM set_team_user WHERE team_user_teamid = $1`;
            await client.query(deleteMembersQuery, [teamId]);

            const userInsertQuery = `
                INSERT INTO set_team_user (team_user_teamid, team_user_userid)
                SELECT $1, user_id
                FROM sys_user
                WHERE user_firstname = ANY($2)
            `;
            await client.query(userInsertQuery, [teamId, userFirstNames]);

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
            const deleteTeamQuery = `DELETE FROM set_team WHERE team_id = $1`;
            await client.query(deleteTeamQuery, [teamId]);

            resolve({ teamId });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const ReorganizeTeamIDs = function (deleteTeamQuery) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            const reorganizeQuery = 
            `UPDATE set_team
                SET team_id = team_id - 1
                WHERE team_id > $1`;
            await client.query(reorganizeQuery, [deleteTeamQuery]);

            resolve();
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};



module.exports = { MainTeam, Addteam, EditTeam, DeleteTeam , ReorganizeTeamIDs};


