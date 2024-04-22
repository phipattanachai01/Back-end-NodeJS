var { connection } = require('../../../connection');
const { generateTeamCode } = require('../middleware/formatConverter');
const MainTeam = async function () {
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

const Addteam = async function (data, formattedDateTime) {
    console.log('🚀 ~ Addteam ~ data[0]:', data[0]);
    console.log('🚀 ~ Addteam ~ data[1]:', data[1]);
    console.log('🚀 ~ Addteam ~ data[2]:', data[2]);
    // console.log("🚀 ~ Addteam ~ data[3]:", data[3])

    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            const maxTeamCodeNumber = await getLatesetTeamcodeNumberFromDatabase(client);
            console.log('🚀 ~ returnnewPromise ~ maxTeamCodeNumber:', maxTeamCodeNumber);
            const teamCode = generateTeamCode(maxTeamCodeNumber);
            console.log('🚀 ~ returnnewPromise ~ teamCode:', teamCode);

            const teamInsertQuery = `
                INSERT INTO set_team (team_code, team_name, team_linetoken, team_createdate, team_status, team_delete) 
                VALUES ($1, $2, $3, $4, 1, 0) 
                RETURNING team_id`;
            const teamResult = await client.query(teamInsertQuery, [teamCode, data[0], data[1], formattedDateTime]);
            const teamId = teamResult.rows[0].team_id;
            console.log('🚀 ~ returnnewPromise ~ teamId:', teamId);

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

// const EditTeam = function (data, user_id) {
//     console.log("🚀 ~ EditTeam ~ user_id:", user_id)
//     console.log("🚀 ~ EditTeam ~ data:", data[2]);
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             var updateTeamQuery = `UPDATE set_team SET team_name = $1 , team_updatedate = $2 WHERE team_id = $3`;
//             var rows = await client.query(updateTeamQuery, [data[1], data[2], data[0]]);

//             var updateMembersQuery = `
//             UPDATE set_team_user
//             SET team_user_teamid = $1,
//                 team_user_updatedate = $2
//             WHERE team_user_teamid = $3
//             AND team_user_userid = ANY($4::int[])
//             `;
//             await client.query(updateMembersQuery, [data[0], data[2], data[0], user_id]);

//             resolve({ team_id: data[1] });
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };

const EditTeam = async function (data, user_id) {
    console.log('🚀 ~ EditTeam ~ user_id:', user_id);
    console.log('🚀 ~ EditTeam ~ data:', data);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            var teamUpdateQuery = `
                UPDATE set_team 
                SET team_name = $1, team_linetoken = $2, team_updatedate = $3 
                WHERE team_id = $4`;
            await client.query(teamUpdateQuery, [data[1], data[2], data[3], data[0]]);

            var deleteUsersQuery = `
            DELETE FROM set_team_user
            WHERE team_user_teamid = $1`;
            await client.query(deleteUsersQuery, [data[0]]);

            if (user_id && user_id.length > 0) {
                for (var id of user_id) {
                    var userInsertQuery = `
                INSERT INTO set_team_user (team_user_teamid, team_user_userid, team_user_createdate)
                VALUES ($1, $2, $3)`;
                    await client.query(userInsertQuery, [data[0], id, data[3]]);
                }
            }
            await client.query('COMMIT');

            resolve();
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.error(error);
        } finally {
            client.release();
        }
    });
};

const DeleteTeam = async function (team_id) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var deleteTeamQuery = `UPDATE set_team SET team_delete = 1 WHERE team_id = $1`;
            await client.query(deleteTeamQuery, team_id);

            // var deleteTeamUsersQuery = `DELETE FROM set_team_user WHERE team_user_teamid = $1`;
            // await client.query(deleteTeamUsersQuery, [teamId]);

            resolve({ teamId });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
// const ReorganizeTeamIDs = function (deletedTeamId, teamId) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             var reorganizeTeamQuery = `
//                 UPDATE set_team
//                 SET team_id = team_id - 1
//                 WHERE team_id > $1
//             `;
//             await client.query(reorganizeTeamQuery, [deletedTeamId]);

//             var reorganizeTeamUsersQuery = `
//                 UPDATE set_team_user
//                 SET team_user_teamid = set_team.team_id
//                 FROM set_team
//                 WHERE set_team_user.team_user_teamid > $1
//                 AND set_team_user.team_user_teamid = set_team.team_id + 1
//             `;
//             await client.query(reorganizeTeamUsersQuery, [deletedTeamId]);

//             resolve();
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };
const statusTeam = async function (params) {
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
};

const checkByTeam = async function (CheckTeam) {
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

const dataEditTeam = async function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT 
            set_team.team_id AS team_id,
            set_team.team_code AS team_code,
            set_team.team_name,
            COALESCE(STRING_AGG(sys_user.user_firstname, ' , '), '0') AS user_firstname
            FROM 
            set_team
            LEFT JOIN 
            set_team_user ON set_team.team_id = set_team_user.team_user_teamid
            LEFT JOIN 
            sys_user ON set_team_user.team_user_userid = sys_user.user_id
            WHERE team_id = $1 AND set_team.team_delete = 0
            GROUP BY 
            set_team.team_id, set_team.team_name
            ORDER BY 
            set_team.team_id`;
            let rows = await client.query(sqlQuery, [1]);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });

}

async function getLatesetTeamcodeNumberFromDatabase(client) {
    try {
        const queryResult = await client.query(
            "SELECT MAX(CAST(SUBSTRING(team_code FROM 5) AS INTEGER)) AS max_team_code_number FROM set_team WHERE team_code <> ''"
        );
        const maxTeamCodeNumber = queryResult.rows[0].max_team_code_number || 0;
        return maxTeamCodeNumber;
    } catch (error) {
        throw error;
    }
}

module.exports = { MainTeam, Addteam, EditTeam, DeleteTeam, statusTeam, dataEditTeam, checkByTeam };
