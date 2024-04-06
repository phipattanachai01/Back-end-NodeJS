var rescode = require('../../../responsecode.json');
let { dateTimeFormater, generateTicketCode , convertDaysToMinutes, convertHoursToMinutes} = require('../middleware/formatConverter');
var {} = require('../../../config/default');
let { verityMidToken } = require('../middleware/functionAuth');
const Ticket = require('../models/ticket');
const moment = require('moment');

const DatalistByTicket = async function (req, res) {
    let params = req.body.company_id ? [req.body.company_id] : null;
    let userId = req.user.id;
    let role = req.user.role
    console.log("🚀 ~ DatalistByTicket ~ role:", role)
    // console.log("🚀 ~ DatalistByTicket ~ userId:", userId)
    try {
        let data = await Ticket.MainTicket(params, userId, role);
        
        let Result = data.map(item => {
            let a = moment();
            let b = moment(item.ticket_orderdate);
            let resultDate = a.diff(b, 'minute');
            let c = item.issue_type;
            let d = item.issue_duedate;
            let sum;
            switch(c) {
                case 1:
                    sum = convertDaysToMinutes(d);
                    break;
                case 2:
                    sum = convertHoursToMinutes(d);
                    break;
                case 3:
                    sum =  d;
                    break;
               
            }
            let comparisonResult = sum < resultDate ? 1 : 0;
            item.ticket_overdue = comparisonResult; 
            item.ticket_orderdate = moment(item.ticket_orderdate).format('DD/MM/YYYY HH:mm');
        });

        let countOverdue = data.reduce((count, item) => {
            if (item.ticket_overdue === 1) {
                count++;
            }
            return count;
        }, 0);
        
        let result = data.reduce((arr, tab) => {
            arr.push({lable: tab.ticket_id})
            return arr;
        },[])
        // console.log("🚀 ~ result ~ result:", result)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            data: data,
            countOverdue: countOverdue
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
    let userId = req.user.id;
    try {
        var params = [
            req.body.ticket_orderdate,
            req.body.ticket_notification_status,
            req.body.ticket_type,
            req.body.ticket_title,
            req.body.ticket_issueid,
            req.body.ticket_companyid,
            req.body.ticket_company_contactid,
            req.body.ticket_cc,
            req.body.ticket_teamid,
            formattedDateTime,
            req.body.ticket_userid,
            req.body.ticket_tagid,
            req.body.detail_details,
            userId        
        ];
        console.log("🚀 ~ CreateTicket ~ params:", params)
        // console.log('🚀 ~ CreateTicket ~ params:', params);
        // console.log("🚀 ~ AddIssue ~ params:", params)
        var data = await Ticket.addTicket(params);
        // console.log("🚀 ~ AddIssue ~ data:", data)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'HH:mm:ss'),
            // data: data,
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

const listdetailByTicket = async function (req, res) {
    let userId = req.user.id;
    let params = [req.body.ticket_id, userId];
    // console.log("🚀 ~ MainNoteByTicket ~ a:", userId);
    try{
        var dataList = await Ticket.listDetail(params);        
        var transformedData = dataList.reduce((acc, item) => {
            item.ticket_createdate = moment(item.ticket_createdate).format('ddd, DD MMM YYYY [at] HH:mm');
            acc.push(item);
            return acc;
        }, []);
            res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: transformedData
        });
    } catch (error) {
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
        return false;
    }
};

const CountByTicket = async function (req, res) {

    let params = [req.body.ticket_id];
    try{
        var datacount = await Ticket.countTicket(params);        
            res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: datacount
        });
    } catch (error) {
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
        return false;
    }
};


const ViewByTicket = async function (req, res) {
    let params = [req.body.ticket_id];
    try{
        var data = await Ticket.ViewTicket(params);        
        var transformedData = data.reduce((acc, item) => {
            item.ticket_createdate = moment(item.ticket_createdate).format('DD/MM/YYYY HH:mm');
            item.ticket_orderdate = moment(item.ticket_orderdate).format('DD/MM/YYYY HH:mm');
            acc.push(item);
            return acc;
        }, []);
            res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: transformedData
        });
    } catch (error) {
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
        return false;
    }
};


const listeditlByTicket = async function (req, res) {
    let params = [req.body.ticket_id];
    try {
        var dataList = await Ticket.listEdit(params);
        
        var transformedData = dataList.map(item => {
            item.ticket_createdate = moment(item.ticket_createdate).format('DD MMMM YYYY HH:mm A');
            
            var userUpdateBy = item.user_updateby === "\"\"" ? null : item.user_updateby.replace(/"/g, '');
            console.log("🚀 ~ Result ~ userUpdateBy:", userUpdateBy)
            return { ...item, user_updateby: userUpdateBy };
        });
        
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: transformedData
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

const AddNoteByTicket = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let userID = req.user.id;
    let params = [req.body.ticket_id, req.body.detail_details, req.body.detail_access, userID, formattedDateTime]
    try {
        var data = await Ticket.addNote(params);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            // data: data
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


const listeditTeamByTicket = async function (req, res) {

    let params = [req.body.ticket_id];
    try{
        var DataList = await Ticket.listEditTeam(params);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataList,
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

const deleteByTicket = async function(req, res) {
    let params = [req.body.ticket_id];
    try{
        var dataDelete = await Ticket.deleteTicket(params);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
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
            catch: error.message
        });
    }
};

const updateByTicket = async function (req, res) {
    let params = [ req.body.ticket_id , req.body.ticket_status_statusid]
    try {
        var data = await Ticket.updateTicket(params);
        console.log("🚀 ~ updateByTicket ~ data:", data)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
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
            catch: error.message
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
            catch: error.message
        });
    }
};

const Tags = async function (req, res) {

    try {
        var Tags = await Ticket.tagTicket();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: Tags
        });
    } catch (error) {
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
    }
}
const Finddate = async function(req, res) {
    let dataDate = [req.body.ticket_createdate, req.body.ticket_createdate]
    try{
        var DataDate = await Ticket.Finddate(dataDate);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataDate
        });
    } catch (error) {
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
    }
}
module.exports = {
    DatalistByTicket,
    CreateTicket,
    listdetailByTicket,
    CompanyTicket,
    ViewByTicket,
    ContactCompany,
    AssignTeamUsers,
    CheckNotificationTicket,
    updateByTicket,
    listeditlByTicket,
    listeditTeamByTicket,
    CountByTicket,
    deleteByTicket,
    AddNoteByTicket,
    Finddate,
    Tags
};
