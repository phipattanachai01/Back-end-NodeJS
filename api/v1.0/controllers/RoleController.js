var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Role = require('../models/role');

const RoleUser = async function (req, res) {
    try {
        var data = [
            req.body.rolename,
            req.body.Dashboard,
            req.body.Notify,
            req.body.Ticket,
            req.body.Company,
            req.body.Structures,
            req.body.General
        ];
        console.log('data: ', data);

        var result = await Role.Addrole(data);
        // console.log('data: ', data);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: result,
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

module.exports = {RoleUser};