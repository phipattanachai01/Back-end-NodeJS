var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
var {} = require('../../../config/default');

const Tag = require('../models/tag');

const CreateByTag = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    let data = [req.body.tag_name, req.body.tag_color, formattedDateTime];
    try {
        const result = await Tag.createTag(data);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: result,
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

const listByTag = async function (req, res) {
    try {
        let data = await Tag.listTag();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            data: data,
        });
    } catch (error) {
        console.log("🚀 ~ listByTag ~ error:", error)
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        });
    }
}

const DeleteByTag = async function (req, res) {
    let tagId = [req.body.tag_id];
    try {
        var data = await Tag.deleteTag(tagId);
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            // data: data
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
}

module.exports = { CreateByTag, 
    DeleteByTag,
    listByTag }