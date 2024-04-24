const rescode = require('../../../responsecode.json');
const { dateTimeFormater } = require('../middleware/formatConverter');
const { notifyLine2 } = require('../middleware/functionBasicCenter');
const Linenoti = require('../models/linenoti');

const TokenLineNoti = async function (req, res) {
    try {
        let params = [req.body.ticket_id];
        let data = await Linenoti.lineNoti(params);
        // let lineToken = data;
        // console.log('🚀 ~ TokenLineNoti ~ lineToken:', lineToken);
        let dataMessage = 'ทดสอบๆ 1';
        // dataMessage = dataMessage + '\r\n' + '';

        // let params_noti = {};
        // params_noti.Message = dataMessage;
        // console.log('🚀 ~ TokenLineNoti ~ params_noti :', params_noti.Message);
        // // params_noti.lineToken = 'KVa9XioxbTCjOSLfcx4G08CNjVeo7Q4Mf7TQ2ngdG3q';
        // params_noti.lineToken = data[0].team_linetoken;
        // let message = await notifyLine2(params_noti);
        if (data[0].ticket_notification_status === 1) {
            let params_noti = {};
            params_noti.Message = dataMessage;
            params_noti.lineToken = data[0].team_linetoken;
            let message = await notifyLine2(params_noti);
            // console.log("🚀 ~ TokenLineNoti ~ message:", message);
        } else if (data[0].ticket_notification_status === 0) {
            return res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: ' ---------> lineNoti_status = 0',
                data: data
            });
        }
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data : data
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
};

module.exports = {
    TokenLineNoti,
};
