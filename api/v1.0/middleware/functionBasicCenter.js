const querystring = require('querystring');
const request = require('request');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const http = require('http');

const CallApiExternal = async function CallApiExternal(params) {
    console.log('🚀 ~ file: functionBasicCenter.js:8 ~ CallApiExternal ~ params:', params);
    return new Promise(function (resolve, reject) {
        let response = {};
        let DataForm = params.DataForm;
        let DataOptions = params.DataOptions;
        request(params, function (error, response) {
            if (error) throw new Error(`${arguments.callee.name} || ${error.name},${error.message}`);
            resolve(response.body);
        });
    });
};
const makeid = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const sendLineNotification = async function (lineToken) {
    try {
        const url = 'https://notify-api.line.me/api/notify';
        const message = {
            to: lineToken,
            messages: [
                {
                    type: 'text',
                    text: 'Notification: Success',
                },
            ],
        };

        const postData = JSON.stringify(message);

        const options = {
            hostname: 'api.line.me',
            port: 443,
            path: '/api/notify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${lineToken}`,
            },
        };

        const req = http.request(options, res => {
            console.log(`Line API response status code: ${res.statusCode}`);
        });

        req.on('error', error => {
            console.error('Error sending request to Line API:', error);
            throw error;
        });

        req.write(postData);
        req.end();

        console.log('Notification sent successfully to Line.');
    } catch (error) {
        console.error('Error sending notification to Line:', error);
        throw error;
    }
};

const notifyLine2 = async function (param) {
    console.log('param--->', param);
    // if (server == 'Prd') {
    let LineTokennoti = param.lineToken;

    let response = {};
    console.log('LineTokennoti : ', LineTokennoti);
    let inviteName = '';
    let memberName = '';
    let Message = '';

    if (typeof param.Message !== 'undefined') {
        Message = param.Message;
    }

    console.log('message = ', param.Message);
    let messagepost = {
        message: Message,
    };
    console.log('messagepost', messagepost);
    let formDataBody = querystring.stringify(messagepost);

    console.log('messagepost : \n');
    console.log(messagepost);

    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + LineTokennoti,
    };

    let options = {
        host: 'notify-api.line.me',
        path: '/api/notify',
        method: 'POST',
        headers: headers,
    };

    let dataResponse = '';
    var https = require('https');
    var req = https.request(options, function (resone) {
        resone.on('data', async function (message) {
            console.log(message);
            try {
                dataResponse = JSON.parse(message);
            } catch (e) {
                dataResponse = e;
            }

            console.log('dataResponse \n');
            console.log(dataResponse);
        });
    });

    req.on('error', function (e) {
        console.log("🚀 ~ e:", e)
        // console.log("ERROR:");
        // console.log(e);
        response.StatusCode = '0004';
        response.Message = 'API error code';
        console.log("🚀 ~ response:", response)
        // console.log(response);
        res.json(response);
    });

    req.write(formDataBody);
    req.end();
    // }
};
module.exports = { CallApiExternal, makeid, sendLineNotification, notifyLine2 };
