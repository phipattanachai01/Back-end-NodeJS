var rescode = require('../../../responsecode.json');
let { dateTimeFormater, addToLoggedInUsers, checkLogin } = require('../middleware/formatConverter');
const { hashPassword, comparePassword, signAccessToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Register = require('../models/user');

const RegisterUser = async function (req, res) {
    let hashPass = await hashPassword({ password: req.body.user_password });
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    // console.log(hashPass);
    let paramsRe = [
        req.body.user_name,
        req.body.user_phone,
        req.body.user_firstname,
        req.body.user_lastname,
        hashPass,
        formattedDateTime,
        req.body.user_rolename,
    ];
    // console.log(paramsRe);

    try {
        await Register.adduse(paramsRe);
        // var accessToken = await signAccessToken(user[0].user_id);

        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            // user_id: user[0].user_id,
            // token: accessToken,
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

// const login = async function (req, res) {
//     let params = [req.body.username];
//     try {

//         var user = await Register.loginuser(params);
//         console.log("🚀 ~ login ~ user:", user)

//         if (!user.length) {
//             return res.send({ status: 401, message: 'NOT FOUND' });
//         }
//         var accessToken = await signAccessToken(user);
//         var data = { req_password: req.body.user_password, password: user[0].user_password };
//         // console.log("🚀 ~ login ~ accessToken:", accessToken)

//         // console.log("🚀 ~ login ~ data:", data)
//         let compare = await comparePassword(data);
//         if (compare) {

//             return res.status(rescode.c1000.httpStatusCode).json({
//                 code: rescode.c1000.businessCode,
//                 message: rescode.c1000.description,
//                 data: {token: accessToken},

//             });

//         } else {
//             res.status(rescode.c9500.httpStatusCode).json({
//                 code: rescode.c9500.businessCode,
//                 message: rescode.c9500.description,
//                 error: rescode.c9500.error,
//                 timeReq: dateTimeFormater(new Date(), 'x'),
//             });
//         }

//     } catch (error) {
//         console.log(error);
//         return res.status(rescode.c5001.httpStatusCode).json({
//             code: rescode.c5001.businessCode,
//             message: rescode.c5001.description,
//             error: rescode.c5001.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//         });
//     }
// };

const login = async function (req, res) {
    let params = [req.body.username];
    try {
        var user = await Register.loginuser(params);
        console.log('🚀 ~ login ~ user:', user);

        if (!user.length) {
            return res.send({ status: 401, message: 'NOT FOUND' });
        }

        var data = { req_password: req.body.user_password, password: user[0].user_password };
        let compare = await comparePassword(data);

        if (compare) {
            var accessToken = await signAccessToken(user);

            return res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                data: { token: accessToken },
            });
        } else {
            res.status(rescode.c9500.httpStatusCode).json({
                code: rescode.c9500.businessCode,
                message: rescode.c9500.description,
                error: rescode.c9500.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
};

const mainUser = async function (req, res) {
    try {
        var DataList = await Register.mainlistByUser();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: DataList,
        });
    } catch (error) {
        console.log(error);
        return res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
};
const updateUser = async function (req, res) {
    let userID = req.params.userID;
    console.log(userID);
    let formattedupdateDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let params = [
        req.body.user_name,
        req.body.user_phone,
        req.body.user_firstname,
        req.body.user_lastname,
        formattedupdateDateTime,
        userID,
    ];
    console.log(params);
    try {
        await Register.updateUser(params, userID);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
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

const deleteuse = async function (req, res) {
    let userID = req.params.userID;
    console.log('🚀 ~ deleteuse ~ userID:', userID);
    try {
        await Register.deleteUser(userID);
        await Register.ReorganizeUserIDs(userID);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: { id: userID },
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

const changePasswordByuser = async function (req, res) {
    let hashPass = await hashPassword({ password: req.body.user_password });
    console.log(hashPass);
    let params = [hashPass, req.body.user_id];
    console.log(params);
    try {
        var changepass = await Register.changePasswordUser(params);

        console.log('data: ', changepass);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: { id: req.body.user_id },
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
const disableuser = async function (req, res) {
    try {
        if (!req.body.user_id || !req.body.user_status) {
            throw new Error('Missing user_id or user_status in request body');
        }
        let user_id = req.body.user_id;
        let user_status = req.body.user_status;

        let params = [user_status, user_id];

        var update = await Register.updateStatus(params);
        console.log('🚀 ~ disableuser ~ update:', update);
        let statusMessage = user_status === '1' ? 'OpenStatus = 1' : 'CloseStatus = 0';
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            status: statusMessage,
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
};

// const checkIfUserExists = async function (req, res) {
//     try {
//         let username = req.body.username
//         let DuplicateUser = await Register.checkUserExists(username)
//         res.status(rescode.c1000.httpStatusCode).json({
//             code: rescode.c1000.businessCode,
//             message: rescode.c1000.description,
//             Data : DuplicateUser
//         });
//     } catch (error) {
//         res.status(rescode.c1111.httpStatusCode).json({
//             code: rescode.c1111.businessCode,
//             message: rescode.c1111.description,
//             error: rescode.c1111.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//         });
//     }
// };

const checkIfUserExists = async function (req, res) {
    try {
        let username = req.body.username;
        let isDuplicate = await Register.checkUserExists(username);
        if (isDuplicate) {
            res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                Data: "duplicate" // คืนค่า "duplicate" เมื่อพบ username ที่ซ้ำ
            });
        } else {
            res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                Data: "not duplicate" // คืนค่า "not duplicate" เมื่อไม่พบ username ที่ซ้ำ
            });
        }
    } catch (error) {
        res.status(rescode.c1111.httpStatusCode).json({
            code: rescode.c1111.businessCode,
            message: rescode.c1111.description,
            error: rescode.c1111.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
};

module.exports = {
    RegisterUser,
    login,
    updateUser,
    deleteuse,
    changePasswordByuser,
    disableuser,
    mainUser,
    checkIfUserExists
};
