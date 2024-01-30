var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
const { hashPassword, comparePassword, signAccessToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const CreateCompany = require('../models/company')
const listByCompany = async function (req, res) {
    
    let data = [req.body.company_fullname, req.body.company_shortname, req.body.company_about, req.body.company_dormain, req.body.company_linetoken, req.body.company_status];
    console.log('data=>',data);
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

const editByCompany = async function ( req, res) {
    let data = [req.body.company_fullname, req.body.company_shortname, req.body.company_about, req.body.company_dormain, req.body.company_linetoken, req.body.company_status, req.body.company_id];

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
                data : data
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

const deleteByCompany = async function (req, res) {
    let data = [req.body.company_id];
    try {
            await CreateCompany.DeleteCompany(data);
            return res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                data : {ID : data}
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

const mainByCompany = async function (req, res) {
    try {
        var data = await CreateCompany.MainCompany();
        var resultItems = data.map(item => ({
            [item.company_fullname]: item.count_result
        }));
        // var companyFullNames = data.map(item => item.company_fullname);

            return res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                data: resultItems
                // data: {company_fullname: companyFullNames}
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

module.exports = { listByCompany , editByCompany , datalist, deleteByCompany, mainByCompany};