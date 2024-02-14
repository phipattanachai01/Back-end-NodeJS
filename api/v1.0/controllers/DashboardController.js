var rescode = require('../../../responsecode.json');
let { dateTimeFormater , label } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Dashboard = require('../models/dashboard');
const DashboardUser = async function (req, res) {
    let dashboard = [req.body];

    try {
        var data = await Dashboard.ListDashboard(dashboard);

        var resultItems = data.map(item => ({
            label: label(item.table_name),
            count: item.count_result,
        }));


        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: resultItems,
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
