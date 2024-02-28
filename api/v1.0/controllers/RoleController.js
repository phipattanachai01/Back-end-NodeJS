var rescode = require('../../../responsecode.json');
let { dateTimeFormater , getCurrentFormattedDateTime} = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Role = require('../models/role');

const ListRoles = async function (req, res) {

    try {
        var data = await Role.Mainrole();
        
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'yyyy-MM-dd'),
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
const RoleUser = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    try {
        var data = {
            role_name: req.body.role_name,
            role_menu: req.body.role_menu,
            
        };
        // console.log("🚀 ~ RoleUser ~ data:", data, formattedDateTime)
        // console.log('data: ', data);

        var result = await Role.Addrole(data, formattedDateTime);
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

const EditRoles = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');

    try {
        const roleId = req.params.RoleId;
        // console.log('___', roleId);
        var data = {
            role_name: req.body.role_name,
            role_menu: req.body.role_menu
        };

        var result = await Role.Editrole(data, roleId, formattedDateTime);

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

const DeleteRoles = async (req, res) => {
    let roleId = req.params.RoleId
    try {
        var DeleteRoles = await Role.Deleterole(roleId);
        await Role.ReorganizeRoleIDs(roleId);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: DeleteRoles
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

const RoleUsers = async (req, res) => {
    try {
        var roleuse = await Role.roleusers();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: roleuse
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
    RoleUser,
    ListRoles,
    EditRoles,
    DeleteRoles,
    RoleUsers
};
