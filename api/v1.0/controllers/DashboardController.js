 var rescode = require('../../../responsecode.json');
let { dateTimeFormater , label } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Dashboard = require('../models/dashboard');
const DashboardUser = async function (req, res) {
    let dashboard = [req.body];

    try {
        var data = await Dashboard.ListDashboard(dashboard);
        console.log("🚀 ~ DashboardUser ~ data:", data)

        var resultItems = data.map(item => ({
            label: label(item.table_name),
            count: item.count_result,
        }));
        // console.log("🚀 ~ resultItems ~ resultItems:", resultItems)

        // var result = data.reduce((arr, tab) => {
        //     arr.push({lable: tab.table_name})
        //     arr.push({count: tab.count_result})
        //     return arr;
        // }, [])
        // console.log("🚀 ~ result ~ result:", result)
        

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: resultItems,
        });
            console.log("🚀 ~ res.status ~ resultItems:", resultItems)
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
