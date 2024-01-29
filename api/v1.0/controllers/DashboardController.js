var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Dashboard = require('../models/dashboard');
const DashboardUser = async function (req, res) {
    let dashboard = [req.body]
    try {
        var data = await Dashboard.ListDashboard(dashboard);
        console.log(data);

        const resultItems = data.map(item => ({
            [item.table_name]: item.count_result
        }));

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: {SumPartner : resultItems[0].sys_company, Active: resultItems[1].sys_user_status_1, InActive: resultItems[2].sys_user_status_0, ContactUser: resultItems[3].sys_company_contact} ,
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
    DashboardUser,
};
