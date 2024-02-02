var { connection } = require('../../../connection');

const AddContact = function (data) {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            const companyShortname = data[0];
            const companyQuery = 'SELECT company_id FROM sys_company WHERE company_shortname = $1';
            const companyResult = await client.query(companyQuery, [companyShortname]);
            const companyId = companyResult.rows[0].company_id;

            const sqlQuery = `
                INSERT INTO sys_company_contact (contact_fullname, contact_nickname, contact_email, contact_phone, contact_about, contact_companyid)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`;

            const rows = await client.query(sqlQuery, [...data.slice(1), companyId]);
            await client.query('COMMIT');
            resolve(rows.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.error(error);
        } finally {
            client.release();
        }
    });
};

const DatalistByContact = function () {
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT 
            sys_company_contact.contact_id,
            sys_company_contact.contact_nickname, 
            sys_company.company_shortname, 
            sys_company_contact.contact_email, 
            sys_company_contact.contact_phone 
            FROM 
            sys_company_contact
            JOIN 
            sys_company ON sys_company_contact.contact_companyid = sys_company.company_id
            ORDER BY sys_company_contact.contact_id`;
            // console.log();
            let rows = await client.query(sqlQuery);
            resolve(rows.rows);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

// const EditByContact = async function (contactId, data) {
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         let transaction;

//         try {
//             transaction = await client.query('BEGIN');

//             console.log('Received data:', data);

//             const contactSqlQuery = `
//                 UPDATE sys_company_contact
//                 SET
//                     contact_fullname = $1,
//                     contact_nickname = $2,
//                     contact_email = $3,
//                     contact_phone = $4,
//                     contact_about = $5
//                 WHERE contact_id = $6
//                 RETURNING *`;

//             if (data[1] === null) {
//                 reject(new Error("Contact fullname cannot be null."));
//                 return;
//             }

//             const contactUpdatedRows = await client.query(contactSqlQuery, [data[1].substring(0, 15), data[2], data[3], data[4], data[5], contactId]);
//             const companyId = contactUpdatedRows.rows[0].contact_companyid;
//             const companySqlQuery = `
//                 UPDATE sys_company
//                 SET
//                     company_fullname = $1
//                 WHERE company_id = $2
//                 RETURNING *`;

//             const companyUpdatedRows = await client.query(companySqlQuery, [data[0], companyId]);

//             await client.query('COMMIT');

//             resolve({
//                 contact: contactUpdatedRows.rows[0],
//                 company: companyUpdatedRows.rows[0],
//             });
//         } catch (error) {
//             if (transaction) {
//                 await client.query('ROLLBACK');
//             }
//             reject(error);
//             console.error(error);
//         } finally {
//             client.release();
//         }
//     });
// };
const EditByContact = function (data) {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            const companyShortname = data[4];
            const companyQuery = 'SELECT company_id FROM sys_company WHERE company_shortname = $1';
            const companyResult = await client.query(companyQuery, [companyShortname]);
            if (companyResult.rows.length === 0) {
                reject(new Error('Company not found'));
                return;
            }
            const companyId = companyResult.rows[0].company_id;
            const contactId = parseInt(data[6]);
            console.log('contactID',contactId);

            if (isNaN(contactId)) {
                reject(new Error('Invalid contactId'));
                return;
            }
            const sqlQuery = `
                UPDATE sys_company_contact 
                SET contact_fullname = $1,
                    contact_nickname = $2,
                    contact_email = $3,
                    contact_phone = $4,
                    contact_about = $5,
                    contact_companyid = $6
                WHERE contact_id = $7
                RETURNING *`;

            const rows = await client.query(sqlQuery, [...data.slice(1, 6), companyId, contactId]);

            if (rows.rows.length === 0) {
                reject(new Error('Contact not found'));
                return;
            }
            await client.query('COMMIT');
            resolve(rows.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.error('Error in EditByContact:', error);

            console.error(error);
        } finally {
            client.release();
        }
    });
};

module.exports = { AddContact, DatalistByContact, EditByContact };
