const rescode = require('../../../responsecode.json');
const { dateTimeFormater } = require('../middleware/formatConverter');
const Contact = require('../models/contact');

const CreateContact = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
    const data = 
    [
        req.body.contact_companyid, 
        req.body.contact_fullname, 
        req.body.contact_nickname, 
        req.body.contact_email, 
        req.body.contact_phone, 
        req.body.contact_about,
        req.body.contact_path || null,
        req.body.contact_url || null
    ];    

    
    try {
        var sumdata = await Contact.AddContact(data , formattedDateTime);
        
        // console.log('sumdata:', sumdata);

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
        var contact = data.map((contact) => {
            var path_image = `${contact.contact_url || ''}/${contact.contact_path || ''}`.trim();
            contact.path_image = path_image;
            delete contact.contact_url;
            delete contact.contact_path;
            return contact;
        });
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data : contact
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

const EditContact = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');

    let data = [
        req.body.contact_fullname,
        req.body.contact_nickname,
        req.body.contact_email,
        req.body.contact_phone,
        req.body.contact_about,
        req.body.contact_companyid,
        req.body.contact_path || null,
        req.body.contact_url || null,
        formattedDateTime,
        req.body.contact_id
    ];
    
    try {
        var updatedData = await Contact.EditByContact(data);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: updatedData
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


const DeleteContact = async function (req, res) {
    let contactId = [req.body.contact_id];
    try {
        var DeleteData = await Contact.DeleteByContact(contactId);
                        //  await Contact.ReorganizeContactIDs(contactId)
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: DeleteData,
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

const checkEmail = async function (req, res)  {
    try {
        const contactemail = req.body.contact_email;
        console.log("🚀 ~ checkUsername ~ username:", contactemail)
        const existingEmail = await Contact.checkEmailByContact(contactemail);
        if (existingEmail) {
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

const dataEditContact = async function (req, res) {
    let params = [req.body.contact_id];
    try {
        var data = await Contact.dataEdit(params)
        var contact = data.map((contact) => {
            var path_image = `${contact.contact_url || ''}/${contact.contact_path || ''}`.trim();
            contact.path_image = path_image;
            delete contact.contact_url;
            delete contact.contact_path;
            return contact;
        });
        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: contact
        });
    } catch (error) {
        res.status(rescode.c5001.httpStatusCode).json({
            code: rescode.c5001.businessCode,
            message: rescode.c5001.description,
            error: rescode.c5001.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
        });
    }
}

module.exports = {
    CreateContact,
    MainContact,
    EditContact,
    DeleteContact,
    checkEmail,
    dataEditContact
}
