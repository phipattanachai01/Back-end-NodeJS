var rescode = require('../../../responsecode.json');
let { dateTimeFormater , generateTicketCode} = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Ticket = require('../models/ticket');

const DatalistByTicket = async function (req, res) {
 try {
    let data = await Ticket.MainTicket();
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
const CreateTicket = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    // let formattedOrderDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    try {
        var params = [
            req.body.ticket_orderdate, 
            req.body.ticket_notification_status,
            req.body.ticket_type,
            req.body.ticket_title,
            req.body.ticket_issueid,
            req.body.ticket_tagid,
            req.body.ticket_companyid,
            req.body.ticket_company_contactid,
            req.body.ticket_cc,
            req.body.ticket_teamid,
            req.body.ticket_userid,
            req.body.ticket_detailid,
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


const CompanyTicket = async function (req, res) {
    try {
        var DataList = await Ticket.DataCompany();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataList,
        });
    } catch (error) {
        console.log(error);
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
};

const ContactCompany = async function (req, res) {
    let contactcompany = [req.body.contact_companyid];
    console.log("🚀 ~ ContactCompany ~ contactcompany:", contactcompany)
    try {
        var DataContact = await Ticket.DatacontactByCompany(contactcompany);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataContact,
        });
    } catch (error) {
        console.log(error);
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
};

const CheckNotificationTicket = async function (req, res) {
    try {
        var DataNotification = await Ticket.DataNotification();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataNotification,
        });
    } catch (error) {
        console.log(error);
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
}

const AssignTeamUsers = async function (req, res) {
    let taemId = req.body.team_id
    try {
        var DataTeam = await Ticket.assignUser(taemId);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataTeam,
        });
    } catch (error) {
        console.log(error);
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
}
module.exports = {DatalistByTicket, CreateTicket , CompanyTicket, ContactCompany, AssignTeamUsers}