var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
var {} = require('../../../config/default');
const Notify = require('../models/notify');

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


module.exports = { MainNotify }