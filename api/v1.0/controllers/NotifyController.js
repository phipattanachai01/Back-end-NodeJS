var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Notify = require('../models/notify');
// const { param } = require('../routes');

const MainNotify = async function (req, res) {
    let dataDate = (req.body.start_date && req.body.end_date) ? [req.body.start_date, req.body.end_date] : null;
    try {

        let data = await Notify.MainNotification(dataDate);

        let totalStatusCountExceptAll = data.reduce((total, item) => {
            if (item.status_id !== 7) {
                return total + parseInt(item.status_count);
            }
            return total;
        }, 0);

        let totalPercentageExceptAll = 0;

        let Resultdata = data.map((item) =>{
            let count = item.status_count;
            let percentage;

            if (item.status_id === 7) {
                percentage = 100;
            } else {
                if (totalStatusCountExceptAll !== 0) {
                    percentage = (count / totalStatusCountExceptAll) * 100;
                    totalPercentageExceptAll += percentage;
                } else {
                    percentage = 0;
                }
            }

            let roundedPercentage;
            if (item.status_id === 7) {
                roundedPercentage = 100;
            } else if (totalStatusCountExceptAll === 0) {
                roundedPercentage = 0;
            } else {
                roundedPercentage = Math.floor(percentage * 100) / 100;
            }

            item.percentage = roundedPercentage.toFixed(2) + '%'; 

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