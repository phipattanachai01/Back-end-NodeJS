const Ticket = require('../models/ticket');

const DeleteTicket = async function (req, res, next) {
    // req.header;
    console.log("🚀 ~ DeleteTicket ~ req:", req.body)
    // Ticket.insertlog(req.body);

    // if (typeof req.body.id == 'undefined') {
    //     res.status(rescode.c1000.httpStatusCode).json({
    //         code: rescode.c1000.businessCode,
    //         message: rescode.c1000.description,
    //     });
    //     return false;
    // }

    
    var verifyParams = {
        ticket_id: req.body.ticket_id,
        
       };
      
       var requiredParams = [];
       for (const key in verifyParams) {
        if (!verifyParams[key]) {
         requiredParams.push(key);
        }
       }
       if (requiredParams.length > 0) {
        return res.status(200).json({
         code: 999,
         message: 'require param' + ` ( ${requiredParams} )`,
         error: true
        });
       }
       next();
};



module.exports = {
    DeleteTicket,
};
