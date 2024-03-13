var rescode = require('../../../responsecode.json');
let { dateTimeFormater , generateTicketCode} = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Ticket = require('../models/ticket');

const CreateTicket = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let formattedOrderDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let ticketCode = generateTicketCode(); 
    console.log("🚀 ~ CreateTicket ~ ticketCode:", ticketCode)

    try {
        var params = [req.body.ticket_code,
            formattedOrderDateTime, 
            req.body.ticket_notification_status,
            req.body.ticket_type,
            req.body.ticket_title,
            req.body.ticket_issueid,
            req.body.ticket_companyid,
            req.body.ticket_company_contactid,
            req.body.ticket_cc,
            req.body.ticket_teamid,
            req.body.ticket_userid,
            req.body.ticket_details,
            formattedDateTime]
        console.log("🚀 ~ CreateTicket ~ params:", params)
        // console.log("🚀 ~ AddIssue ~ params:", params)
        var data = await Ticket.addTicket(params);
        // console.log("🚀 ~ AddIssue ~ data:", data)
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

module.exports = { CreateTicket}