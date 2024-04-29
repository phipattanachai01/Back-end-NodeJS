var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Menu = require('../models/menu');

const ListMenu = async function (req, res) {
    try {
        var data = await Menu.mainmenu();

        var topLevelMenus = data.filter(item => item.menu_parents === null);

        var formattedData = topLevelMenus.map(menuItem => {
            var subItems = data.filter(item => item.menu_parents === menuItem.menu_id);
            return {
                ...menuItem,
                ...(subItems.length > 0 && { sub: subItems }),
            };
        }).map(menuItem => {
            if (menuItem.sub && menuItem.sub.length === 0) {
                delete menuItem.sub;
            }
            return menuItem;
        });
        
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: formattedData
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

function formatSubMenu(menuId, data) {
    var subItems = data.filter(item => item.menu_pareat === menuId);
    var formattedSubItems = subItems.map(subItem => ({
        ...subItem,
        sub: formatSubMenu(subItem.menu_id, data),
    }));
    return formattedSubItems;
}

// const ListMenu = async function (req , res) {
//     try {
//         var data = await Menu.mainmenu();
//         var subItems4 = data.filter(item => item.menu_pareat === 4);

//         // Filter out sub-items for menu_id 7
//         var subItems7 = data.filter(item => item.menu_pareat === 7);

//         // Filter out sub-items for menu_id 11
//         var subItems11 = data.filter(item => item.menu_pareat === 11);

//         // Create a map of menu items for quicker lookup
//         var menuMap = new Map(data.map(item => [item.menu_id, item]));

//         // Format data
//         var formattedData = data.map(menuItem => ({
//             menu_id: menuItem.menu_id,
//             menu_name: menuItem.menu_name,
//             menu_url: menuItem.menu_url,
//             menu_status: menuItem.menu_status,
//             menu_pareat: menuItem.menu_pareat,
//             menu_type: menuItem.menu_type,
//             menu_createdate: menuItem.menu_createdate,
//             menu_updatedate: menuItem.menu_updatedate ? menuItem.menu_updatedate : null,
//             menu_level: menuItem.menu_level,
//             sub: menuItem.menu_id === 4 ? subItems4.map(subItem => ({
//                 ...subItem,
//                 sub: []
//             })) : menuItem.menu_id === 7 ? subItems7.map(subItem => ({
//                 ...subItem,
//                 sub: []
//             })) : menuItem.menu_id === 11 ? subItems11.map(subItem => ({
//                 ...subItem,
//                 sub: []
//             })) : []
//         }));
//         console.log("🚀 ~ formattedData ~ formattedData:", formattedData)
//         res.status(rescode.c1000.httpStatusCode).json({
//             code: rescode.c1000.businessCode,
//             message: rescode.c1000.description,
//             error: rescode.c1000.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//             Data: formattedData,
//         });
//     } catch (error) {
//         res.status(rescode.c5001.httpStatusCode).json({
//             code: rescode.c5001.businessCode,
//             message: rescode.c5001.description,
//             error: rescode.c5001.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//             catch: error.message,
//         });
//         return false;
//     }
// };

const UpdateMenu = async function (req, res) {
    let formattedupdateDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    try {
        var data = {
            role_menu: req.body.role_menu,
        };
        var result = await Menu.Updatemenu(data, formattedupdateDateTime);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            Data: result,
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

const SideMenu = async function (req, res) {
    let params = req.user;
    try {

        var data = await Menu.sideMenu(params);
        let newData = data.map(item => ({
            menu_id: item.menu_id,
            menu_name: item.menu_name,
            menu_url: item.menu_url,
            icon: item.menu_icon,
            menu_parents: item.menu_parents,
            role: {
                role_menu_id: item.role_menu_id,
                role_menu_roleid: item.role_menu_roleid,
                role_menu_menuid: item.role_menu_menuid,
                role_menu_permissions: item.role_menu_permissions.trim().toUpperCase()
            }
        }));

        var topLevelMenus = newData.filter(item => item.menu_parents === null);

        var formattedData = topLevelMenus.map(menuItem => {
            var subItems = newData.filter(item => item.menu_parents === menuItem.menu_id);
            var formattedSubItems = subItems.map(subItem => ({
                ...subItem,
                children: subItem.menu_id === 5 || subItem.menu_id === 6 || subItem.menu_id === 8 || subItem.menu_id === 9 || subItem.menu_id === 10 || subItem.menu_id === 12 || subItem.menu_id === 13 ? undefined : formatSubMenu(subItem.menu_id, newData),
            }));
            return {
                ...menuItem,
                children: formattedSubItems,
            };
        });

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: formattedData
        });
    } catch (error) {
        {
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
};

module.exports = { ListMenu, UpdateMenu, SideMenu };
