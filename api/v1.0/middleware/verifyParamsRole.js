var rescode = require('../../../responsecode.json');
const role = async function (req, res, next) {
    var verifyParams = {
        role_name: req.body.role_name,
        role_menu: req.body.role_menu
};
    var requiredParams = [];
    for (const key in verifyParams) {
        if (!verifyParams[key]) {
            requiredParams.push(key);
        }
    }
    if (requiredParams.length > 0) {
        return res.status(200).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }

    if (!req.body.role_menu.every(menu => {
        return ['RW', 'R', 'NA'].includes(menu.role_menu_permissions) &&
               !(/^\d+$/.test(menu.role_menu_permissions));
    })) {
        return res.status(200).json({
            message: rescode.c5001.description,
            message: 'Error: role_menu_permissions must be RW, R, or NA and not a numeric ID',
            error: true,
        });
    }
    next();
}

const Editrole = async function (req, res, next) {
    var verifyParams = {
        role_id: req.body.role_id,
        role_name: req.body.role_name,
        role_menu: req.body.role_menu
    };
    var requiredParams = [];
    for (const key in verifyParams) {
        if (!verifyParams[key]) {
            requiredParams.push(key);
        }
    }

    if (requiredParams.length > 0) {
        return res.status(400).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }

    var validPermissions = ['RW', 'R', 'NA'];
    for (var menu of verifyParams.role_menu) {
        if (!menu.hasOwnProperty('role_menu_permissions') || !validPermissions.includes(menu.role_menu_permissions)) {
            requiredParams.push('role_menu (invalid permissions)');
            break; // Exit the loop after finding the first error
        }
    }

    if (requiredParams.length > 0) {
        return res.status(400).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }

    next();
}


module.exports = { role, Editrole };