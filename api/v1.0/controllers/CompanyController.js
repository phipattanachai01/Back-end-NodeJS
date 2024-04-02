var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
const { hashPassword, comparePassword, signAccessToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const CreateCompany = require('../models/company');
const createByCompany = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let data = [
        req.body.company_fullname,
        req.body.company_shortname,
        req.body.company_about,
        req.body.company_dormain,
        formattedDateTime,
    ];
    try {
        await CreateCompany.CreateCompany(data);
        return res.status(rescode.c1000.httpStatusCode).json({
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
};

const editByCompany = async function (req, res) {
    let companyId = req.params.companyId;
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let data = [
        req.body.company_fullname,
        req.body.company_shortname,
        req.body.company_about,
        req.body.company_dormain,
        req.body.company_linetoken,
        formattedDateTime,
        companyId,
    ];

    try {
        await CreateCompany.updateCompany(data);
        return res.status(rescode.c1000.httpStatusCode).json({
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
};

const datalist = async function (req, res) {
    // let data = [req.company_fullname, req.company_shortname, req.company_about, req.company_dormain, req.company_linetoken, req.company_status, req.company_id];
    try {
        var data = await CreateCompany.DatalistByCompany();
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
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

const deleteByCompany = async function (req, res) {
    let companyId = req.params.companyId;
    try {
        await CreateCompany.DeleteCompany(companyId);
        // await CreateCompany.ReorganizeCompanyIDs(companyId);
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: { ID: companyId },
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
        return false;
    }
};

const mainByCompany = async function (req, res) {
    try {
        var data = await CreateCompany.MainCompany();
        // console.log("🚀 ~ mainByCompany ~ data:", data)
        // var resultItems = data.map(item => ({
        //     companyid: item.company_id,
        //     CompanyFullname: item.company_fullname,
        //     contactCompany: item.count_result,
        //     companyStatus: item.company_status
        // }));

        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: data,
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
        return false;
    }
};
const StatusCompany = async function (req, res) {
    try {
        const params = [req.body.company_status, req.body.company_id];
        await CreateCompany.updateCompanyStatus(params);
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
        });
    } catch (error) {
        console.error(error);
        return res.status(rescode.c1103.httpStatusCode).json({
            code: rescode.c1103.businessCode,
            message: rescode.c1103.description,
            error: rescode.c1103.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
};

// const ViewByTicket = async function (req, res) {
//     let params = [req.body.company_id]
//  try {
//     var data = await CreateCompany.ViewTicket(params);
//     return res.status(rescode.c1000.httpStatusCode).json({
//         code: rescode.c1000.businessCode,
//         message: rescode.c1000.description,
//         data: data,
//     });
//  } catch (error) {
//     res.status(rescode.c5001.httpStatusCode).json({
//         code: rescode.c5001.businessCode,
//         message: rescode.c5001.description,
//         error: rescode.c5001.error,
//         timeReq: dateTimeFormater(new Date(), 'x'),
//         catch: error.message,
//     });
//     return false;
//  }
//  };


const countContact = async function (req, res) {
    let params = [req.body.company_id];
    try {
        var data = await CreateCompany.CountContactCompany(params);
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
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

const listName = async function (req, res) {
    let params = [req.body.company_id]
 try {
    var data = await CreateCompany.ListOfNames(params);
    return res.status(rescode.c1000.httpStatusCode).json({
        code: rescode.c1000.businessCode,
        message: rescode.c1000.description,
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


module.exports = {
    createByCompany,
    editByCompany,
    datalist,
    deleteByCompany,
    mainByCompany,
    StatusCompany,
    countContact,
    listName
};
