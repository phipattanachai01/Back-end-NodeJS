var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
// const { hashPassword, comparePassword, signAccessToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Issue = require('../models/issue');

const AddIssue = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    try {
        var params = [req.body.issue_name, req.body.priority_name, req.body.issue_duedate, req.body.issue_type_name, formattedDateTime]
        // console.log("🚀 ~ AddIssue ~ params:", params)
        var data = await Issue.addIssue(params);
        console.log("🚀 ~ AddIssue ~ data:", data)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            data: data
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
        return false;
    }

};

const UpdateIssue = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    try {
        var IssueId = req.params.IssueId;
        var params = [req.body.issue_name, req.body.priority_name, req.body.issue_duedate, req.body.issue_type_name, formattedDateTime, IssueId]
        // console.log("🚀 ~ AddIssue ~ params:", params)
        var data = await Issue.updateIssue(params);
        console.log("🚀 ~ AddIssue ~ data:", data)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            data: data
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
        return false;
    }
}


// const DeleteIssue = async function (req, res) {
//     try {
//         var issueId = req.params.IssueId;
//         console.log("🚀 ~ DeleteIssue ~ issueId:", issueId)
//         await Issue.deleteIssue(issueId);
//         await Issue.ReorganizeIssueIDs(issueId)
//             res.status(rescode.c4000.httpStatusCode).json({
//                 code: rescode.c4000.businessCode,
//                 message: rescode.c4000.description,
//                 error: rescode.c4000.error,
//                 timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
//                 data: { deletedRows: issueId }
//             });
//     } catch (error) {
//         res.status(rescode.c5001.httpStatusCode).json({
//             code: rescode.c5001.businessCode,
//             message: rescode.c5001.description,
//             error: rescode.c5001.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//         });
//     }
// }

const DeleteIssue = async function (req, res) {
    try {
        var issueId = req.params.IssueId;
        console.log("🚀 ~ DeleteIssue ~ issueId:", issueId);
        
        await Issue.deleteIssue(issueId);
        await Issue.ReorganizeIssueIDs(issueId);
            res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            });
        
    } catch (error) {
        console.log("🚀 ~ DeleteIssue ~ error:", error);
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
}

module.exports = { AddIssue, UpdateIssue, DeleteIssue };


