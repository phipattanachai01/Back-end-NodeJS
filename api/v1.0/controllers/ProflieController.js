var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Proflie = require('../models/proflie');
// const ProflieUser = async function (req, res) {
//     try {
//         let param = [req.user];
       
//         var data = await Proflie.Proflie(param);
//         var extractedData = data.map((user) => ({
//             id: user.user_id,
//             firstname: user.user_firstname,
//             lastname: user.user_lastname,
//             role_name: user.role_name,
//             user_language: user.user_language,
//             path_images: `${user.user_url || ''}/${user.user_path || ''}`.trim()
//         }));
//         console.log("🚀 ~ extractedData ~ extractedData:", extractedData)
//         res.status(rescode.c1000.httpStatusCode).json({
//             code: rescode.c1000.businessCode,
//             message: rescode.c1000.description,
//             error: rescode.c1000.error,
//             timeReq: dateTimeFormater(new Date(), 'dddd / HH:mm:ss'),
//             data: extractedData        
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

const ProflieUser = async function (req, res) {
    try {
        let param = [req.user];
       
        var data = await Proflie.Proflie(param);
        var extractedData = data.map((user) => ({
            id: user.user_id,
            firstname: user.user_firstname,
            lastname: user.user_lastname,
            role_name: user.role_name,
            user_language: user.user_language,
            path_images: `${user.user_url || ''}/${user.user_path || ''}`.trim()
        }));
        console.log("🚀 ~ extractedData ~ extractedData:", extractedData)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'dddd / HH:mm:ss'),
            data: extractedData        
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


// const ProflieUser = async function (req, res) {
//     try {
//         let param = [req.user];
       
//         var data = await Proflie.Proflie(param);
//         var extractedData = {
//             id: data[0].user_id,
//             firstname: data[0].user_firstname,
//             lastname: data[0].user_lastname,
//             role_name: data[0].role_name,
//             user_language: data[0].user_language,
//             path_images: `${data[0].user_url || ''}/${data[0].user_path || ''}`.trim()
//         };
//         res.status(rescode.c1000.httpStatusCode).json({
//             code: rescode.c1000.businessCode,
//             message: rescode.c1000.description,
//             error: rescode.c1000.error,
//             timeReq: dateTimeFormater(new Date(), 'dddd / HH:mm:ss'),
//             data: extractedData        
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

const UpdateProfileUser = async function (req, res) {
    // let param = [req.body.username, req.body.username];
    // let params = [req.body.name, req.body.password];
    try {
        // var data = await Register.adduse(params);
        // console.log('data: ', data);
        // var data = await Proflie.Proflie();
        // console.log('data: ', data);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
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

module.exports = {
    ProflieUser,
    UpdateProfileUser,
};
