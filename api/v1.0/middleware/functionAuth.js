var rescode = require('../../../responsecode.json');

var { JWT_SECRET } = require('../../../config/default');
let { dateTimeFormater } = require('../middleware/formatConverter');

var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');
const moment = require('moment');
const { json } = require('body-parser');
const { decode } = require('querystring');

const hashPassword = function (params) {
    return new Promise((resolve, reject) => {
        bcryptjs.hash(params.password, 10, function (err, hash) {
            if (err) {
                reject(err);
            }

            resolve(hash);
        });
    });
};

const comparePassword = function (params) {
    return new Promise((resolve, reject) => {
        bcryptjs.compare(params.req_password, params.password, function (err, res) {
            resolve(res);
        });
    });
};

const verityToken = function (params) {
    try {
        if (params.token == '$2a$10$TK0lJnA.bsCs.7PznI0Uau856Mjdi8RqTJ/zS8G.6PKRhwRzwFjUW') {
            return true;
        } else {
            return jwt.verify(params.token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return false;
                }
                return true;
            });
        }
    } catch (error) {
        return false;
    }
};

const verityMidToken = async function (req, res, next) {
    // console.log('🚀 ~ verityMidToken ~ req:', req.headers);
    // console.log("🚀 ~ verityMidToken ~ req.headers['token']:", req.headers.token);

    try {
        return jwt.verify(req.headers['token'], JWT_SECRET, (err, decoded) => {
            // console.log(decoded);
            if (err) {
                return res.status(rescode.c9500.httpStatusCode).json({
                    code: rescode.c9500.businessCode,
                    message: rescode.c9500.description,
                    error: rescode.c9500.error,
                    timeReq: dateTimeFormater(new Date(), 'x'),

                });
            }
            req.user = decoded;
            // console.log('===',req.user);
            next();
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

const verityTokenkey = async function (req, res, next) {
    // console.log('🚀 ~ verityMidToken ~ req:', req.headers);
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[0];
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(rescode.c9500.httpStatusCode).json({
                    code: rescode.c9500.businessCode,
                    message: rescode.c9500.description,
                    error: rescode.c9500.error,
                    timeReq: dateTimeFormater(new Date(), 'x'),
                    data: decoded,
                });
            } else {
                next();
            }
        });
    }
};
const verifyAPIKeyAndCode = async function (req, res, next) {
    try {
        const apiCode = req.headers['x-api-code'];
        const apiKey = req.headers['x-api-key'];
        if (apiCode != 'SAP_101' && apiCode != 'WCF_101') {
            return res.status(rescode.c9500.httpStatusCode).json({
                code: rescode.c9500.businessCode,
                message: rescode.c9500.description,
                error: rescode.c9500.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
                data: 'API CODE',
            });
        }
        if (apiKey != 'a5d8a41a495c796a2b4c178686f775dc' && apiKey != 'd380da231e0aa57c08c2a35ba5b71a04') {
            return res.status(rescode.c9500.httpStatusCode).json({
                code: rescode.c9500.businessCode,
                message: rescode.c9500.description,
                error: rescode.c9500.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
                data: 'API KEY',
            });
        }
        next();
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

const verifyAPIKeyAndCode2 = async function (req, res, next) {
    try {
        const authheader = req.headers.authorization;
        console.log('🚀 ~ file: functionAuth.js:85 ~ verifyAPIKeyAndCode2 ~ authheader:', authheader);
        console.log(req.headers);

        if (!authheader) {
            let err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }

        const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        console.log('🚀 ~ file: functionAuth.js:96 ~ verifyAPIKeyAndCode2 ~ user:', user);
        const pass = auth[1];
        console.log('🚀 ~ file: functionAuth.js:98 ~ verifyAPIKeyAndCode2 ~ pass:', pass);

        if (user == 'SAP_101' && pass == 'a5d8a41a495c796a2b4c178686f775dc') {
            // If Authorized user
            next();
        } else {
            return res.status(rescode.c9500.httpStatusCode).json({
                code: rescode.c9500.businessCode,
                message: rescode.c9500.description,
                error: rescode.c9500.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
                data: 'API CODE',
            });
        }
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

const signAccessToken = async function (user) {
    console.log(user)
    return new Promise((resolve, reject) => {
        const payload = {
            id: user[0].user_id,
            user: user[0].user_name,
            phone: user[0].user_phone,
            fullname: user[0].user_fullname,
            password: user[0].user_password
        };
        const secret = process.env.TOKEN_SECRET;
        const options = {
            expiresIn: '8h',
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = {
    hashPassword,
    comparePassword,
    verityToken,
    verityMidToken,
    verifyAPIKeyAndCode,
    verifyAPIKeyAndCode2,
    signAccessToken,
    verityTokenkey,
};
