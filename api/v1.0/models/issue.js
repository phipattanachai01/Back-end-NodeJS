const { connection } = require('../../../connection');

const main = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT issue_id, issue_name, issue_priority ,issue_duedate, issue_type FROM set_issue WHERE issue_delete = 0`;
            let rows = await client.query(sqlQuery);
            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const addIssue = function (params) {
    // console.log("🚀 ~ addIssue ~ params:", params)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            // let issuePriorityIdQuery = `SELECT priority_id FROM sys_priority WHERE priority_name = $1`;
            // let issuePriorityIdResult = await client.query(issuePriorityIdQuery, [params[1]]);
            // let issue_priorityid = issuePriorityIdResult.rows[0].priority_id;

            // let issueTypeIdQuery = `SELECT issue_type_id FROM set_issue_type WHERE issue_type_name = $1`;
            // let issueTypeIdResult = await client.query(issueTypeIdQuery, [params[3]]);
            // let issue_typeid = issueTypeIdResult.rows[0].issue_type_id;

            var sqlQuery = `INSERT INTO set_issue (issue_id, issue_name, issue_priority, issue_duedate, issue_type, issue_createdate, issue_delete) VALUES (nextval('set_issue_seq'), $1, $2, $3, $4, $5,0)`;
            let rows = await client.query(sqlQuery, params);
            console.log('🚀 ~ returnnewPromise ~ rows:', rows.rows);

            resolve({ issueName: params[0] });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};
const updateIssue = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            // let issuePriorityIdQuery = `SELECT priority_id FROM sys_priority WHERE priority_name = $1`;
            // let issuePriorityIdResult = await client.query(issuePriorityIdQuery, [params[1]]);
            // let issue_priorityid = issuePriorityIdResult.rows[0].priority_id;

            // let issueTypeIdQuery = `SELECT issue_type_id FROM set_issue_type WHERE issue_type_name = $1`;
            // let issueTypeIdResult = await client.query(issueTypeIdQuery, [params[3]]);
            // let issue_typeid = issueTypeIdResult.rows[0].issue_type_id;

            var sqlQuery = `UPDATE sys_issue SET issue_name = $1, issue_priorityid = $2, issue_duedate = $3, issue_typeid = $4, issue_updatedate = $5 WHERE issue_id = $6`;
            let rows = await client.query(sqlQuery, params);
            // console.log('🚀 ~ returnnewPromise ~ rows:', rows.rows);

            resolve({ issueName: params[0] });
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const deleteIssue = async function (issueId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `UPDATE SET sys_issue SET issue_delete = 1 WHERE issue_id = $1`;
            let rows = await client.query(sqlQuery, issueId);
            resolve(rows.rowCount);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

// const ReorganizeIssueIDs = function (issueId) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             var sqlQuery = `UPDATE sys_issue SET issue_id = issue_id - 1 WHERE issue_id > $1`;
//             let rows = await client.query(sqlQuery, [issueId]);
//             await client.query("SELECT setval('set_issue_seq', COALESCE((SELECT MAX(issue_id) FROM sys_issue), 0))");
//             resolve(rows.rows); 
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };


const Priority = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM sys_priority ORDER BY priority_id`;
            let rows = await client.query(sqlQuery);
            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};


const typesDate = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM set_issue_type ORDER BY issue_type_id`;
            let rows = await client.query(sqlQuery);
            console.log(rows.rows);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const checkIssue = async function (issueName) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT * FROM set_issue WHERE issue_name = $1 AND issue_delete = 0`;
            let rows = await client.query(sqlQuery, issueName);
            resolve(rows.rows.length > 0);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    })
};

const dataEditIssue = async function (issueId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT issue_id, issue_name, issue_priority, issue_duedate, issue_type FROM set_issue WHERE issue_id = $1 AND issue_delete = 0`;
            let rows = await client.query(sqlQuery, issueId);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
        } finally {
            client.release();
        }
    })
}
module.exports = { main, addIssue, updateIssue, deleteIssue , Priority, typesDate , checkIssue, dataEditIssue};
