const Ticket = require('../models/ticket');

const insertlog = async function (req, res) {
    req.header;

    Ticket.insertlog(req.body);

    if (typeof req.body.id == 'undefined') {
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
        });
        return false;
    }

    next();
};

module.exports = {
    insertlog,
};
