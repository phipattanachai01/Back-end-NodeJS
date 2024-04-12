var { connection } = require('../../../connection');

const AddContact = function (data, formattedDateTime) {
    console.log('🚀 ~ AddContact ~ data:', data);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            const sqlQuery = `
                INSERT INTO company_contact 
                (contact_companyid, contact_fullname, contact_nickname, contact_email, contact_phone, 
                    contact_about, contact_createdate, contact_delete)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
                `;
            const rows = await client.query(sqlQuery, [...Object.values(data), formattedDateTime]);
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
            company_contact.contact_id,
            company_contact.contact_nickname, 
            company.company_fullname, 
            company_contact.contact_email, 
            company_contact.contact_phone 
            FROM 
                company_contact
            JOIN 
                company ON company_contact.contact_companyid = company.company_id
            WHERE contact_delete = 0
            ORDER BY company_contact.contact_id`;
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

// const EditByContact = function (data) {
//     console.log(data);
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             await client.query('BEGIN');
//             const companyShortname = data[4];
//             const companyQuery = 'SELECT company_id FROM sys_company WHERE company_shortname = $1';
//             const companyResult = await client.query(companyQuery, [companyShortname]);
//             if (companyResult.rows.length === 0) {
//                 reject(new Error('Company not found'));
//                 return;
//             }
//             const companyId = companyResult.rows[0].company_id;
//             const contactId = parseInt(data[6]);
//             console.log('contactID',contactId);

//             if (isNaN(contactId)) {
//                 reject(new Error('Invalid contactId'));
//                 return;
//             }
//             const sqlQuery = `
//                 UPDATE sys_company_contact
//                 SET contact_fullname = $1,
//                     contact_nickname = $2,
//                     contact_email = $3,
//                     contact_phone = $4,
//                     contact_about = $5,
//                     contact_companyid = $6
//                 WHERE contact_id = $7
//                 RETURNING *`;

//             const rows = await client.query(sqlQuery, [...data.slice(1, 6), companyId, contactId]);

//             if (rows.rows.length === 0) {
//                 reject(new Error('Contact not found'));
//                 return;
//             }
//             await client.query('COMMIT');
//             resolve(rows.rows[0]);
//         } catch (error) {
//             await client.query('ROLLBACK');
//             reject(error);
//             console.error('Error in EditByContact:', error);

//             console.error(error);
//         } finally {
//             client.release();
//         }
//     });
// };
const EditByContact = function (data, formattedDateTime) {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');
            const companyShortname = data[4];
            const companyQuery = 'SELECT company_id FROM sys_company WHERE company_shortname = $1';
            const companyResult = await client.query(companyQuery, [companyShortname]);
            // console.log("🚀 ~ returnnewPromise ~ companyResult:", companyResult)
            if (companyResult.rows.length === 0) {
                reject(new Error('Company not found'));
                return;
            }
            const companyId = companyResult.rows[0].company_id;
            console.log('🚀 ~ returnnewPromise ~ companyId:', companyId);
            const contactId = parseInt(data[6]);
            console.log('contactID', contactId);

            if (isNaN(contactId)) {
                reject(new Error('Invalid contactId'));
                return;
            }
            // const fullname = data[0];
            // console.log("🚀 ~ returnnewPromise ~ fullname:", fullname)
            // const about = data[5];
            // console.log("🚀 ~ returnnewPromise ~ about:", about)
            const sqlQuery = `
                UPDATE company_contact 
                SET contact_fullname = $1,
                    contact_nickname = $2,
                    contact_email = $3,
                    contact_phone = $4,
                    contact_about = $5,
                    contact_companyid = $6,
                    contact_updatedate = $7
                WHERE contact_id = $8
                RETURNING * `;
            console.log('🚀 ~ returnnewPromise ~ slice:', [fullname, ...data.slice(1, 4)]);

            const rows = await client.query(sqlQuery, [
                data[0],
                ...data.slice(1, 4),
                data[5],
                companyId,
                formattedDateTime,
                contactId,
            ]);

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
        } finally {
            client.release();
        }
    });
};

const DeleteByContact = function (contactId) {
    // console.log("🚀 ~ DeleteByContact ~ contactId:", contactId)
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            await client.query('BEGIN');

            // var deleteQuery = 'DELETE FROM company_contact WHERE contact_id = $1';
            // await client.query(deleteQuery, [contactId]);

            var updateQuery = 'UPDATE company_contact SET contact_delete =  1 WHERE contact_id = $1';
            await client.query(updateQuery, contactId);

            await client.query('COMMIT');
            resolve("Delete successful");
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};


// const ReorganizeContactIDs = function (contactId) {
//     // console.log("🚀 ~ ReorganizeContactIDs ~ contactId:", contactId)
//     return new Promise(async (resolve, reject) => {
//         const client = await connection.connect();
//         try {
//             var sqlQuery = `UPDATE company_contact SET contact_id = contact_id - 1 WHERE contact_id > $1`;
//             var rows = await client.query(sqlQuery, [contactId]);
//             await client.query(
//                 "SELECT setval('company_contact_seq', COALESCE((SELECT MAX(contact_id) FROM company_contact), 0))"
//             );
//             resolve(rows.rows);
//         } catch (error) {
//             reject(error);
//             console.log(error);
//         } finally {
//             client.release();
//         }
//     });
// };

const checkEmailByContact = function (contactemail) {
    console.log('🚀 ~ checkEmailByContact ~ contactemail:', contactemail);
    return new Promise(async (resolve, reject) => {
        const client = await connection.connect();
        try {
            var sqlQuery = `SELECT * FROM company_contact WHERE contact_email = $1`;
            let rows = await client.query(sqlQuery, [contactemail]);
            resolve(rows.rows.length > 0);
        } catch (error) {
            reject(error);
            console.log(error);
        } finally {
            client.release();
        }
    });
};

module.exports = {
    AddContact,
    DatalistByContact,
    EditByContact,
    DeleteByContact,
    checkEmailByContact,
    // ReorganizeContactIDs,
};
