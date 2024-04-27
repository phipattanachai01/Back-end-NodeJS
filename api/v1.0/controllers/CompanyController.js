var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
const { hashPassword, comparePassword, signAccessToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Company = require('../models/company');
const createByCompany = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let data = [
        req.body.company_fullname,
        req.body.company_shortname,
        req.body.company_about,
        req.body.company_domain,
        req.body.company_path || null,
        req.body.company_url || null,
        formattedDateTime,
    ];
    console.log("🚀 ~ createByCompany ~ data:", data)
    try {
        await Company.CreateCompany(data);
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
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let data = [
        req.body.company_fullname ,
        req.body.company_shortname,
        req.body.company_about,
        req.body.company_domain,
        req.body.company_path || null,
        req.body.company_url || null,
        formattedDateTime,
        req.body.company_id
        ];

    try {
        await Company.updateCompany(data);
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
        var data = await Company.DatalistByCompany();
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
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

const deleteByCompany = async function (req, res) {
    let companyId = [req.body.company_id];
    try {
        await Company.DeleteCompany(companyId);
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
        var companyData = await Company.MainCompany();
        var companies = companyData.map((company) => {
            var path_image = `${company.company_url || ''}/${company.company_path || ''}`.trim();
            company.path_image = path_image;
            delete company.company_url;
            delete company.company_path;
            return company;
        });

        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: companies
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: error.message, 
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
};

const StatusCompany = async function (req, res) {
    try {
        let params = 
        [
            req.body.company_status, 
            req.body.company_id
        ];
        await Company.updateCompanyStatus(params);
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
        var data = await Company.CountContactCompany(params);
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
    var data = await Company.ListOfNames(params);
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

 const dataEditCompany = async function(req, res) {
    let params = [req.body.company_id];
    try {
        var data = await Company.dataEdit(params);
        var companies = data.map((company) => {
            var path_image = `${company.company_url || ''}/${company.company_path || ''}`.trim();
            company.path_image = path_image;
            delete company.company_url;
            delete company.company_path;
            return company;
        });
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: companies
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

module.exports = {
    createByCompany,
    editByCompany,
    datalist,
    deleteByCompany,
    mainByCompany,
    StatusCompany,
    countContact,
    listName,
    dataEditCompany
};
