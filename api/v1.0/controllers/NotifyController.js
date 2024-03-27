var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Notify = require('../models/notify');
// const { param } = require('../routes');

const MainNotify = async function (req, res) {
    try {
        let data = await Notify.MainNotification();

        let totalCount = data.reduce((acc, item) => acc + item.status_count, 0);

        let Resultdata = data.map((item) =>{
            // let id = item.status_id;
            let count = item.status_count;
            let percentage = ((count / totalCount) * 100).toFixed(2);

            // console.log("🚀 ~ Resultdata ~ count:", count);
            // console.log("🚀 ~ Resultdata ~ id:", id);
            // console.log("🚀 ~ Resultdata ~ percentage:", percentage);

            item.percentage = percentage;

            return item;
        });
        
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: Resultdata
        });
        
        console.log("🚀 ~ res.status ~ data:", data);
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