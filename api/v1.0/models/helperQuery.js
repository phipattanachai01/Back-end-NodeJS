var { DB_SCHEMA_1, DB_SCHEMA_2, DB_SCHEMA_3 } = require('../../../config/default');

/**
 *
 * @param {params{}} params
 * {
 * 	table_name: "t1",
 * 	columns: ['a','b'],
 * 	where: ['t.c = 1 AND'],
 * 	join: [{ table_join:'INNER JOIN t2' , on_join:'t2.a = t1.a' }],
 * 	otherSql: "LIMIT 1"
 * }
 */
function selectDb(params) {
    let querySelect = `SELECT ${params.columns}`;
    let queryFrom = `FROM ${params.table_name}`;
    let queryWhere = 'WHERE 1=1';
    var quereJoin = '';
    var groupBy = ``;
    var queryOther = '';
    if (params.where) {
        for (const key in params.where) {
            queryWhere += `${params.where[key]}`;
        }
    }
    if (params.join) {
        for (const key in params.join) {
            quereJoin += ` ${params.join[key]}`;
        }
    }
    if (params.group_by) {
        if (params.group_by.length > 0) {
            groupBy = `GROUP BY ${params.group_by}`;
        }
    }
    if (params.otherSql) {
        queryOther = `${params.otherSql}`;
    }
    let sqlQuery = `${querySelect} ${queryFrom} ${quereJoin} ${queryWhere} ${groupBy} ${queryOther}`;

    return sqlQuery;
}

function insertDb(params) {
    let insert = `INSERT INTO ${params.table_name} (${Object.keys(params.insertData)})
	VALUES(${Object.values(params.insertData)}) `;
    let sqlQuery = ` ${insert} `;
    if (params.returns && params.returns.length > 0) {
        let returning = `RETURNING ${params.returns}`;
        sqlQuery += returning;
    }

    return sqlQuery;
}

function updateDb(params) {
    console.log('🚀 ~ file: helperQuery.js:57 ~ updateDb ~ params:', params);
    let queryWhere = '';
    if (params.where.length > 0) {
        queryWhere = 'WHERE ';
        for (const key in params.where) {
            queryWhere += `${params.where[key]}`;
        }
    }
    var setup = [];
    Object.keys(params.setup).forEach(key => {
        if (params.setup[key] === null || params.setup[key] == '') {
            if (params.setup[key] === 0) {
                setup.push(`${key} = '${params.setup[key]}'`);
            } else {
                setup.push(`${key} = DEFAULT `);
            }
        } else if (typeof params.setup[key] != 'undefined') {
            setup.push(`${key} = '${params.setup[key]}'`);
        }
    });
    if (params.from != '') {
        var from = ` FROM ${params.from} `;
    } else {
        var from = ``;
    }
    let update = `UPDATE ${params.table_name} SET ${setup}${from}${queryWhere} `;
    let sqlQuery = ` ${update} `;

    if (params.returns.length > 0) {
        let returning = `RETURNING ${params.returns}`;
        sqlQuery += returning;
    }

    return sqlQuery;
}

module.exports = {
    selectDb,
    insertDb,
    updateDb,
};
