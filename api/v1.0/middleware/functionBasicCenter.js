const querystring = require('querystring');
const request = require('request');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

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

module.exports = { CallApiExternal, makeid };
