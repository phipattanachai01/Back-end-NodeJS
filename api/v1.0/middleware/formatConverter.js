// const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz');
// var differenceInDays = require('date-fns/differenceInDays');
// var localeTH = require('date-fns/locale/th');
// var { addYears } = require('date-fns');
// const { getLatestTicketCodeNumberFromDatabase } = require('../models/ticket')
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

// --------------------------------------------------------------->
/**
 * Converter to camelCase.
 * @param {*} o
 * @returns Object
 */
const isObject = function (o) {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
};
const isArray = function (a) {
    return Array.isArray(a);
};
const toCamel = s => {
    return s.replace(/([-_][a-z])/gi, $1 => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
};

const keysToCamel = function (o) {
    if (isObject(o)) {
        const n = {};

        Object.keys(o)
            .sort()
            .forEach(k => {
                n[toCamel(k)] = keysToCamel(o[k]);
            });

        return n;
    } else if (isArray(o)) {
        return o.sort().map(i => {
            return keysToCamel(i);
        });
    }

    return o;
};

const toSnake = s => {
    var result = s.replace(/([A-Z])/g, ' $1');
    return result.split(' ').join('_').toLowerCase();
};
const keysToSnake = function (o) {
    if (isObject(o)) {
        const n = {};

        Object.keys(o)
            .sort()
            .forEach(k => {
                n[toSnake(k)] = keysToSnake(o[k]);
            });

        return n;
    } else if (isArray(o)) {
        return o.sort().map(i => {
            return keysToSnake(i);
        });
    }

    return o;
};
// --------------------------------------------------------------->

function dateTimeFormater(d, f) {
    switch (f) {
        default: // yyyy-mm-dd HH:mm:ss
            // var date = format(d, f, { timeZone: 'Asia/Bangkok' });
            var date = moment(d).format(f);

            break;
    }
    return date;
}


function dateSubString(d, f) {
    d = d + '';
    var setYears = 543;
    var year = d.substring(0, 4);
    var month = d.substring(4, 6);
    var day = d.substring(6, 8);
    d = `${year}-${month}-${day}`;
    var date = moment(d).add(setYears, 'y').format(f); // format(addYears(new Date(d), setYears), f, { timeZone: 'Asia/Bangkok', locale: localeTH });
    return date;
}

function dateDiff(s, e) {
    const result = s.diff(e); //differenceInDays(new Date(s), new Date(e));
    return result;
}
function getMenuName(index) {
    switch (index) {
        case 1:
            return 'Dashboard';
        case 2:
            return 'Notify';
        case 3:
            return 'Ticket';
        case 4:
            return 'Company';
        case 5:
            return 'Structures';
        case 6:
            return 'General';
        default:
            return '';
    }
}
function convertDaysToMinutes(days) {
    return moment.duration(days, 'days').asMinutes();
}

function convertHoursToMinutes(hours) {
    return moment.duration(hours, 'hours').asMinutes();
}
const validateEmail = email => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
function label(tableName) {
    switch (tableName) {
        case 'company':
            return 'Partner register';
        case 'sys_user_status_1':
            return 'Active';
        case 'sys_user_status_0':
            return 'Inactive';
        case 'company_contact':
            return 'Contact user';
        default:
            return '';
    }
};


function generateTicketCode(maxTicketCodeNumber) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const formattedDateTime = `${year}${month}${day}`;
    const paddedNumber = String(maxTicketCodeNumber + 1).padStart(3, '0');
    return `T${formattedDateTime}-${paddedNumber}`;
}


const generateTeamCode = (maxTeamCodeNumber) => {
    const digits = 5; 
    const prefix = 'TEAM'; 
    const paddedNumber = String(maxTeamCodeNumber + 1).padStart(digits, '0'); 
    return `${prefix}${paddedNumber}`; 
};







module.exports = {
    keysToCamel,
    dateTimeFormater,
    dateSubString,
    dateDiff,
    convertDaysToMinutes,
    convertHoursToMinutes,
    validateEmail,
    keysToSnake,
    getMenuName,
    label,
    generateTicketCode,
    generateTeamCode
    // generateTicketCode
    };
