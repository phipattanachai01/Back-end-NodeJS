var rescode = require('../../../responsecode.json');

const DeleteTicket = async function (req, res, next) {
    // req.header;
    console.log('🚀 ~ DeleteTicket ~ req:', req.body);
    // Ticket.insertlog(req.body);

    // if (typeof req.body.id == 'undefined') {
    //     res.status(rescode.c1000.httpStatusCode).json({
    //         code: rescode.c1000.businessCode,
    //         message: rescode.c1000.description,
    //     });
    //     return false;
    // }

    var verifyParams = {
        ticket_id: req.body.ticket_id,
    };

    var requiredParams = [];
    for (const key in verifyParams) {
        if (!verifyParams[key]) {
            requiredParams.push(key);
        }
    }
    if (requiredParams.length > 0) {
        return res.status(200).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }
    next();
};

const CreateTicket = async function (req, res, next) {
    var verifyParams = {
        ticket_orderdate : req.params.ticket_orderdate,
        ticket_notification_status : req.body.ticket_notification_status,
        ticket_type : req.body.ticket_type,
        ticket_title : req.body.ticket_title,
        ticket_issueid : req.body.ticket_issueid,
        ticket_companyid : req.body.ticket_companyid,
        ticket_company_contactid : req.body.ticket_company_contactid,
        ticket_teamid : req.body.ticket_teamid,
        ticket_details : req.body.ticket_details        
    };
    var requiredParams = [];
    for (const key in verifyParams) {
        if (!verifyParams[key]) {
            requiredParams.push(key);
        }
    }
    if (requiredParams.length > 0) {
        return res.status(200).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }
    next();
};

const listFile = async function (req, res, nexr) {
    var verifyParams = {
        detail_id : req.body.detail_id
    };
    var requiredParams = [];
    for (const key in verifyParams) {
        if (!verifyParams[key]) {
            requiredParams.push(key);
        }
    }
    if (requiredParams.length > 0) {
        return res.status(200).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }
    next();
}
module.exports = {
    DeleteTicket,
    CreateTicket,
    listFile
};
