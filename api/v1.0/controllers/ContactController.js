const rescode = require('../../../responsecode.json');
const { dateTimeFormater } = require('../middleware/formatConverter');
const Contact = require('../models/contact');

const CreateContact = async function (req, res) {
    const data = [req.body.company_shortname, req.body.contact_fullname, req.body.contact_nickname, req.body.contact_email, req.body.contact_phone, req.body.contact_about];    

    // console.log('+++++++>', data);
    
    try {
        var sumdata = await Contact.AddContact(data);
        
        console.log('sumdata:', sumdata);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: sumdata,
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

const MainContact = async function (req, res) {
    try {
        var data = await Contact.DatalistByContact();
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            Data : data
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

const EditContact = async function (req, res) {
    const contactId = req.params.contactId; 
    const data = [ req.body.contact_fullname, req.body.contact_nickname, req.body.contact_email, req.body.contact_phone, req.body.company_shortname, req.body.contact_about, contactId]; 

    try {
        var updatedData = await Contact.EditByContact(data);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: updatedData,
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
    CreateContact,
    MainContact,
    EditContact
}
