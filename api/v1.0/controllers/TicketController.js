var rescode = require('../../../responsecode.json');
let { dateTimeFormater, generateTicketCode , convertDaysToMinutes, convertHoursToMinutes} = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Ticket = require('../models/ticket');
const moment = require('moment');

const DatalistByTicket = async function (req, res) {
    try {
        let data = await Ticket.MainTicket();
        // var a = moment([2007, 0, 29]);
        // console.log('🚀 ~ DatalistByTicket ~ a:', a);
        // var b = moment([2007, 0, 28]);
        // console.log('🚀 ~ DatalistByTicket ~ b:', b);
        // a.diff(b, 'days'); // 1
        // console.log('🚀 ~ DatalistByTicket ~ data:', data);
        // var time = moment();
        // console.log('🚀 ~ DatalistByTicket ~ time:', time);
        // var time2 = new Date();
        // console.log('🚀 ~ DatalistByTicket ~ time:', time2);

        let Result = data.map(item => {
            let id = (item.ticket_id)
            // console.log("🚀 ~ Result ~ id:", id)
            let a = moment();
            // console.log('🚀 ~ Result ~ a:', a);
            let b = moment(item.ticket_orderdate);
            // console.log('🚀 ~ Result ~ b:', b);
            let resultDate = a.diff(b, 'minute');
            // console.log('🚀 ~ Result ~ resultDate:', resultDate);
            let c = item.issue_type;
            // console.log('🚀 ~ Result ~ c:', c);
            let d = item.issue_duedate;
            // console.log('🚀 ~ Result ~ d:', d);
            let sum;
            switch(c) {
                case 1:
                    sum = convertDaysToMinutes(d);
                    // console.log("🚀 ~ Result ~ sum:", sum)
                    break;
                    // return sum;
                case 2:
                    sum = convertHoursToMinutes(d);
                    // console.log("🚀 ~ Result ~ sum:", sum)
                    break;
                    // return sum;
                case 3:
                    sum =  d;
                    // console.log("🚀 ~ Result ~ sum:", sum)
                    break;
               
            }
            let comparisonResult = sum < resultDate ? 1 : 0;
            // console.log("🚀 ~ Result ~ comparisonResult:", comparisonResult)
            item.ticket_notification = comparisonResult; 
        });

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            data: data,
        });
    } catch (error) {
        console.log('🚀 ~ DatalistByTicket ~ error:', error);
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
            formattedDateTime,
        ];
        // console.log('🚀 ~ CreateTicket ~ params:', params);
        // console.log("🚀 ~ AddIssue ~ params:", params)
        var data = await Ticket.addTicket(params);
        // console.log("🚀 ~ AddIssue ~ data:", data)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            data: data,
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
    // console.log('🚀 ~ ContactCompany ~ contactcompany:', contactcompany);
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
    let ticket_id = [req.body.ticket_id];
    try {
        var DataNotification = await Ticket.DataNotification(ticket_id);
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
};

const AssignTeamUsers = async function (req, res) {
    let taem_id = req.body.team_id;
    // console.log('🚀 ~ AssignTeamUsers ~ taemId:', taem_id);
    try {
        var DataTeam = await Ticket.assignUser(taem_id);
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
};
module.exports = {
    DatalistByTicket,
    CreateTicket,
    CompanyTicket,
    ContactCompany,
    AssignTeamUsers,
    CheckNotificationTicket,
};
