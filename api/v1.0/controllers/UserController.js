var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
const { hashPassword, comparePassword, signAccessToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Register = require('../models/user');

const RegisterUser = async function (req, res) {
    let hashPass = await hashPassword({ password: req.body.user_password });
    // console.log(hashPass);
    let paramsRe = [req.body.user_name, req.body.user_phone, req.body.user_firstname, req.body.user_lastname, hashPass];

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
const login = async function (req, res) {
    let params = [req.body.username];
    // console.log(params);
    try {
        var user = await Register.userlistByusername(params);
        // console.log([user[0].user_id]);
        // // var accessToken = await signAccessToken(user[0].user_id);
        // console.log('+++++++======+++++',user[0].user_name)
        if (!user.length) {
            return res.send({ status: 401, message: 'NOT FOUND' });
        }
        // console.log('🚀 ~ login ~ user:', user);

        // var accessToken = await signAccessToken( user[0].user_id,user[1],user_name);
        // var accessToken = await signAccessToken(user[0].user_id);
        var accessToken = await signAccessToken(user);

        var data = { req_password: req.body.user_password, password: user[0].user_password };

        let compare = await comparePassword(data);
        console.log('🚀 ~ login ~ compare:', compare);
        if (compare) {

            return res.status(rescode.c1000.httpStatusCode).json({
                code: rescode.c1000.businessCode,
                message: rescode.c1000.description,
                data: {token: accessToken}
                // data: {token: accessToken}
                
            });
        } else {
            res.status(rescode.c5001.httpStatusCode).json({
                code: rescode.c5001.businessCode,
                message: rescode.c5001.description,
                error: rescode.c5001.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
                catch: error.message,
            });
        }

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
    // let hashPass = await hashPassword({ password: req.body.user_password });
    // console.log(hashPass);
    let params = [req.body.user_name, req.body.user_phone, req.body.user_fullname, req.body.user_id];
    console.log(params);
    try {

        await Register.updateUser(params);

        console.log('data: ', req.body.user_id);

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
    let params = [req.body.user_id];
    console.log(params);

    try {
        var deleteuse = await Register.deleteUser(params);
        // console.log('data: ', deleteuse);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: {id: params}
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
    let params = [hashPass, req.body.user_id ];
    console.log(params);
    try {
        var changepass = await Register.changePasswordUser(params);

        console.log('data: ', changepass);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: {id: req.body.user_id}
    
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
    RegisterUser,
    login,
    updateUser,
    deleteuse,
    changePasswordByuser
};
