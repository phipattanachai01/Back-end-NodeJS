var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Notify = require('../models/notify');
// const { param } = require('../routes');

const MainNotify = async function (req, res) {
    let dataDate = (req.body.start_date && req.body.end_date) ? [req.body.start_date, req.body.end_date] : null;
    console.log("🚀 ~ MainNotify ~ dataDate:", dataDate)
    try {
        let data = await Notify.MainNotification(dataDate);
        // console.log("🚀 ~ MainNotify ~ data:", data)


        let totalStatusCount = data.find(item => item.status_id === 7).status_count;

        let Resultdata = data.map((item) =>{
            let count = item.status_count;
            let percentage;

            if (totalStatusCount !== 0) {
                if (item.status_id !== 7) {
                    percentage = (count / totalStatusCount) * 100;
                } else {
                    percentage = 100;
                }
            } else {
                percentage = 0;
            }

            let formattedPercentage = percentage % 1 === 0 ? parseInt(percentage) : percentage.toFixed(1);

            item.percentage = formattedPercentage + '%'; 

            return item;
        });
        
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: Resultdata
        });
        
    } catch (error) {
        console.error(error); 
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
        });
    }
};

const listNotification = async function (req, res) {
    let param = [req.body.notify_userid]
    try {
        var data = await Notify.listnoti(param);
        
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'yyyy-MM-dd'),
            data: data,
        });
            // console.log("🚀 ~ res.status ~ data:", data)
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

const updateStatus = async function (req, res) {
    let param = [req.body.notify_status, req.body.notify_id]
    try {
        var data = await Notify.updateStatusNoti(param);
        
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
}

module.exports = { MainNotify , listNotification, updateStatus}