var rescode = require('../../../responsecode.json');

const company = async function (req, res, next) {

    var verifyParams = {
        company_id: req.body.company_id
    };

    var requiredParams = [];
    for (const key in verifyParams) {
        if (!verifyParams[key]) {
            requiredParams.push(key);
        }
    }
    if (requiredParams.length > 0) {
        return res.status(200).json({
            message: rescode.c5001.description,
            message: 'require param' + ` ( ${requiredParams} )`,
            error: true,
        });
    }
    next();
};

module.exports = { company };