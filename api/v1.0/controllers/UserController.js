var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
const { hashPassword, comparePassword, signAccessToken} = require('../middleware/functionAuth');
var {} = require('../../../config/default');
let { verityMidToken } = require('../middleware/functionAuth');
const Register = require('../models/user');

const RegisterUser = async function (req, res) {
    let hashPass = await hashPassword({ password: req.body.user_password });
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let userId = req.user.id;
    console.log('🚀 ~ RegisterUser ~ userId:', userId);

    // console.log(hashPass);
    let paramsRe = [
        req.body.user_name,
        req.body.user_phone,
        req.body.user_firstname,
        req.body.user_lastname,
        hashPass,
        formattedDateTime,
        req.body.user_rolename,
        userId,
        req.body.filePath || null,
        req.body.fileUrl || null,
    ];
    // console.log(paramsRe);
    try {
        let data = await Register.adduse(paramsRe);
        // var accessToken = await signAccessToken(user[0].user_id);

        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: data,
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

        var data = { req_password: req.body.user_password, password: user[0].user_password };
        let compare = await comparePassword(data);
        console.log('🚀 ~ login ~ data:', data);

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
        let DataList = await Register.mainlistByUser();
        UserList = DataList.map(user => {
            var path_image = `${user.user_url || ''}/${user.user_path || ''}`.trim();
            user.path_image = path_image;
            delete user.user_path;
            delete user.user_url;
            return user;
        });
        //     DataList = DataList.map((user) => {
        //     var path_image = `${user.user_url || ''}/${user.user_path || ''}`.trim();
        //     user.path_image = path_image.replace(/^\//, '');
        //     return user;
        // })
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
    let userID = req.body.user_id;
    let hashPass = await hashPassword({ password: req.body.user_password });

    // console.log(userID);
    let formattedupdateDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let params = [
        req.body.user_name,
        req.body.user_phone,
        req.body.user_firstname,
        req.body.user_lastname,
        hashPass,
        req.body.user_roleid,
        req.body.user_url || null,
        req.body.user_path || null,
        formattedupdateDateTime,
        userID,
    ];
    // console.log(params);
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
    let userID = [req.body.user_id];
    console.log('🚀 ~ deleteuse ~ userID:', userID);
    try {
        await Register.deleteUser(userID);
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
// UserStatus
const disableuser = async function (req, res) {
    try {
        // if (!req.body.user_id || !req.body.user_status) {
        //     throw new Error('Missing user_id or user_status in request body');
        // }
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
const checkUsername = async function (req, res) {
    try {
        const username = req.body.user_name;
        console.log('🚀 ~ checkUsername ~ username:', username);
        const existingUser = await Register.checkUserExists(username);
        if (existingUser) {
            return res.status(400).json({ message: 'มีผู้ใช้งานชื่อนี้แล้ว' });
        } else {
            return res.status(200).json({ message: 'ชื่อผู้ใช้งานสามารถใช้งานได้' });
        }
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
};

const dataEdit = async function (req, res) {
    let params = [req.body.user_id];
    try {
        let data = await Register.dataEdit(params);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: data
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


const listroleUser = async function  (req, res) {
    try {
        let data = await Register.roleUser();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: data
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message
        });
    }
};

// const editpass = async function (req, res) {
//     let oldPasswordData = {
//         req_password: req.body.old_user_password, 
//         password: req.body.user_password 
//     };

//     let compareOldPassword = await comparePassword(oldPasswordData);
    
//     if (!compareOldPassword) {
//         return res.status(rescode.c4010.httpStatusCode).json({
//             code: rescode.c4010.businessCode,
//             message: rescode.c4010.description,
//             error: rescode.c4010.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//         });
//     }

//     let newPasswordHash = await hashPassword({ password: req.body.user_password }); 
//     let params = [newPasswordHash, req.body.user_id]; 

//     try {
//         var changepass = await Register.changePasswordUser(params); 

//         res.status(rescode.c1000.httpStatusCode).json({
//             code: rescode.c1000.businessCode,
//             message: rescode.c1000.description,
//             data: { id: req.body.user_id },
//         });
//     } catch (error) {
//         res.status(rescode.c5001.httpStatusCode).json({
//             code: rescode.c5001.businessCode,
//             message: rescode.c5001.description,
//             error: rescode.c5001.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//             catch: error.message,
//         });
//     }
// };

module.exports = {
    RegisterUser,
    login,
    updateUser,
    deleteuse,
    changePasswordByuser,
    disableuser,
    mainUser,
    checkUsername,
    dataEdit,
    listroleUser
};
