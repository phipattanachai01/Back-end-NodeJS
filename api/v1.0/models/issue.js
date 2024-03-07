const { connection } = require('../../../connection');

const main = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let sqlQuery = `SELECT sys_issue.issue_id, 
            sys_issue.issue_name, 
            sys_priority.priority_name AS priority_name,
            sys_issue.issue_duedate, 
            set_issue_type.issue_type_name AS issue_type_name
            FROM sys_issue 
            JOIN sys_priority  ON sys_issue.issue_priorityid = sys_priority.priority_id
            JOIN set_issue_type  ON sys_issue.issue_typeid = set_issue_type.issue_type_id
            `;
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
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let issuePriorityIdQuery = `SELECT priority_id FROM sys_priority WHERE priority_name = $1`;
            let issuePriorityIdResult = await client.query(issuePriorityIdQuery, [params[1]]);
            let issue_priorityid = issuePriorityIdResult.rows[0].priority_id;

            let issueTypeIdQuery = `SELECT issue_type_id FROM set_issue_type WHERE issue_type_name = $1`;
            let issueTypeIdResult = await client.query(issueTypeIdQuery, [params[3]]);
            let issue_typeid = issueTypeIdResult.rows[0].issue_type_id;

            var sqlQuery = `INSERT INTO sys_issue (issue_id, issue_name, issue_priorityid, issue_duedate, issue_typeid, issue_createdate) VALUES (nextval('set_issue_seq'), $1, $2, $3, $4, $5)`;
            let rows = await client.query(sqlQuery, [params[0], issue_priorityid, params[2], issue_typeid, params[4]]);
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
            let issuePriorityIdQuery = `SELECT priority_id FROM sys_priority WHERE priority_name = $1`;
            let issuePriorityIdResult = await client.query(issuePriorityIdQuery, [params[1]]);
            let issue_priorityid = issuePriorityIdResult.rows[0].priority_id;

            let issueTypeIdQuery = `SELECT issue_type_id FROM set_issue_type WHERE issue_type_name = $1`;
            let issueTypeIdResult = await client.query(issueTypeIdQuery, [params[3]]);
            let issue_typeid = issueTypeIdResult.rows[0].issue_type_id;

            var sqlQuery = `UPDATE sys_issue SET issue_name = $1, issue_priorityid = $2, issue_duedate = $3, issue_typeid = $4, issue_updatedate = $5 WHERE issue_id = $6`;
            let rows = await client.query(sqlQuery, [
                params[0],
                issue_priorityid,
                params[2],
                issue_typeid,
                params[4],
                params[5],
            ]);
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

const deleteIssue = async function (issueId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `DELETE FROM sys_issue WHERE issue_id = $1`;
            let rows = await client.query(sqlQuery, [issueId]);
            resolve(rows.rowCount);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

const ReorganizeIssueIDs = function (issueId) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `UPDATE sys_issue SET issue_id = issue_id - 1 WHERE issue_id > $1`;
            let rows = await client.query(sqlQuery, [issueId]);
            await client.query("SELECT setval('set_issue_seq', COALESCE((SELECT MAX(issue_id) FROM sys_issue), 0))");
            resolve(rows.rows); 
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

module.exports = { main, addIssue, updateIssue, deleteIssue, ReorganizeIssueIDs };
