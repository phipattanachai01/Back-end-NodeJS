var rescode = require('../../../responsecode.json');
let { dateTimeFormater , getCurrentFormattedDateTime} = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Role = require('../models/role');
const moment = require('moment');

const ListRoles = async function (req, res) {

    try {
        var data = await Role.Mainrole();
        var result = data.map((item) => {
            item.role_createdate = moment(item.role_createdate).format('DD-MM-YYYY');
            return item;
        })
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'yyyy-MM-dd'),
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
const RoleUser = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    try {
        var data = {
            role_name: req.body.role_name,
            role_menu: req.body.role_menu
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
        var data = [
            req.body.role_id,
            req.body.role_name,
            req.body.role_menu,
            formattedDateTime
        ];

        var result = await Role.Editrole(data, formattedDateTime);

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
    let roleId = [req.body.role_id];
    console.log("🚀 ~ DeleteRoles ~ roleId:", roleId)
    try {
        var DeleteRoles = await Role.Deleterole(roleId);
        // await Role.ReorganizeRoleIDs(roleId);
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

const dataRole = async function (req, res) {
    try {
        var role = await Role.datarole();
        var buildSubMenu = (parentId) => {
            return role.filter(menu => menu.menu_parents === parentId).map(menu => {
                return {
                    ...menu,
                    sub: buildSubMenu(menu.menu_id)
                };
            });
        };

        var menuStructure = buildSubMenu(null);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: menuStructure
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

const updateStatusRole = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let params = [req.body.role_id, req.body.role_status, formattedDateTime]
    try {
        let data = await Role.updateStatus(params)
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

const dataEditRole = async function (req, res) {
    let params = [req.body.role_id];
    try {
        let data = await Role.DataEdit(params)
        let roleData = {
            role_id: data[0].role_id,
            role_name: data[0].role_name,
            role_menu: data.map((item) => ({
                role_menu_menuid: item.role_menu_menuid,
                role_menu_permissions: item.role_menu_permissions.trim()
            }))
        };
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: roleData                  
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
        return false;
    }
    };

module.exports = {
    RoleUser,
    ListRoles,
    EditRoles,
    DeleteRoles,
    RoleUsers,
    dataRole,
    updateStatusRole,
    dataEditRole
};
