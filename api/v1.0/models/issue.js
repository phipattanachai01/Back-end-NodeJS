var {connection} = require('../../../connection')

const addIssue = function (params) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            let issueIdQuery = `SELECT issue_id FROM sys_issue WHERE issue_name = $1`;
            let issueIdResult = await client.query(issueIdQuery, [issue_name]);
            let issue_id = issueIdResult.rows[0].issue_id;
            
            let issuePriorityIdQuery = `SELECT priority_id FROM sys_priority WHERE priority_name = $1`;
            let issuePriorityIdResult = await client.query(issueTypeIdQuery, [priority_name]);
            let issue_priorityid = issueTypeIdResult.rows[0].priority_id;
            
            let issueTypeIdQuery = `SELECT issue_type_id FROM set_issue_type WHERE issue_type_name = $1`;
            let issueTypeIdResult = await client.query(issueTypeIdQuery, [issue_type_name]);
            let issue_typeid = issueTypeIdResult.rows[0].issue_type_id;

            var sqlQuery = `INSERT INTO sys_issue (issue_name, issue_priorityid, issue_duedate, issue_typeid, issue_createdate) VALUES ($1, $2, $3, $4, NOW())`;
            let rows = await client.query(sqlQuery, [issue_name, issue_priorityid, issue_duedate, issue_typeid]);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
}

module.exports = { addIssue };