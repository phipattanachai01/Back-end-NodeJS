var { connection } = require('../../../connection');
const { generateTeamCode } = require('../middleware/formatConverter') 
const MainTeam = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT 
            set_team.team_id AS team_id,
            set_team.team_code AS team_code,
            set_team.team_name,
            COALESCE(STRING_AGG(sys_user.user_firstname, ', '), '0') AS user_firstname,
            COUNT(set_team_user.team_user_userid) AS number_of_people
            FROM 
            set_team
            LEFT JOIN 
            set_team_user ON set_team.team_id = set_team_user.team_user_teamid
            LEFT JOIN 
            sys_user ON set_team_user.team_user_userid = sys_user.user_id
            WHERE set_team.team_delete = 0
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

const Addteam = function (data , formattedDateTime) {
console.log("🚀 ~ Addteam ~ data[0]:", data[0])
console.log("🚀 ~ Addteam ~ data[1]:", data[1])
console.log("🚀 ~ Addteam ~ data[2]:", data[2])
// console.log("🚀 ~ Addteam ~ data[3]:", data[3])


    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            const maxTeamCodeNumber = await getLatesetTeamcodeNumberFromDatabase(client);
            console.log("🚀 ~ returnnewPromise ~ maxTeamCodeNumber:", maxTeamCodeNumber)
            const teamCode = generateTeamCode(maxTeamCodeNumber); 
            console.log("🚀 ~ returnnewPromise ~ teamCode:", teamCode)

            const teamInsertQuery = `
                INSERT INTO set_team (team_code, team_name, team_linetoken, team_createdate, team_status, team_delete) 
                VALUES ($1, $2, $3, $4, 1, 0) 
                RETURNING team_id`;
                const teamResult = await client.query(teamInsertQuery, [teamCode, data[0], data[1], formattedDateTime]);
                const teamId = teamResult.rows[0].team_id;
            console.log("🚀 ~ returnnewPromise ~ teamId:", teamId)

            // Check if user_firstname is provided before inserting user data
            if (data[2] && data[2].length > 0) {
                const userInsertQuery = `
                    INSERT INTO set_team_user (team_user_teamid, team_user_userid, team_user_createdate)
                    SELECT $1, unnest($2::int[]), $3`;
                await client.query(userInsertQuery, [teamId, data[2], formattedDateTime]);
            }

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


async function getLatesetTeamcodeNumberFromDatabase(client) {
    try {
        const queryResult = await client.query(
            'SELECT MAX(CAST(SUBSTRING(team_code FROM 5) AS INTEGER)) AS max_team_code_number FROM set_team WHERE team_code <> \'\''
        );
        const maxTeamCodeNumber = queryResult.rows[0].max_team_code_number || 0;
        return maxTeamCodeNumber;
    } catch (error) {
        throw error;
    }
}



module.exports = { MainTeam, Addteam, EditTeam, DeleteTeam , ReorganizeTeamIDs, statusTeam, checkByTeam};


