var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Proflie = require('../models/proflie');
const ProflieUser = async function (req, res) {
    // let params = [req.body.name, req.body.password];
    try {
        let param = [req.user];
        console.log("🚀 ~ ProflieUser ~ param:", param)
       
        var data = await Proflie.Proflie(param);
        // console.log('data: ', data);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: {id:param[0].id, firstname: param[0].firstname, lastname: param[0].lastname , role: data[0].role_name},
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

const UpdateProfileUser = async function (req, res) {
    // let param = [req.body.username, req.body.username];
    // let params = [req.body.name, req.body.password];
    try {
        // var data = await Register.adduse(params);
        // console.log('data: ', data);
        // var data = await Proflie.Proflie();
        // console.log('data: ', data);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
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
    ProflieUser,
    UpdateProfileUser,
};
