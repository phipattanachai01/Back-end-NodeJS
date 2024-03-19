var rescode = require('../../../responsecode.json');
let { dateTimeFormater } = require('../middleware/formatConverter');
let { verityMidToken } = require('../middleware/functionAuth');
var {} = require('../../../config/default');
const Team = require('../models/team');

const MainTeamUser = async function (req, res) {
    try {
        const result = await Team.MainTeam();
        // console.log('======>',result);
        const formattedData = result.map(item => ({
            team_id: item.team_id,
            team_code: item.team_code,
            team_name: item.team_name,
            user_firstname: item.user_firstname,
            number_of_people: item.number_of_people,
        }));

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: formattedData,
        });
            console.log("🚀 ~ res.status ~ formattedData:", formattedData)
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

// const AddTeamUser = async function (req, res) {
//     let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');

//     try {
//         const data = [req.body.team_name, req.body.user_id]

//         // if (!req.body.team_name || !req.body.user_firstname || !Array.isArray(req.body.user_firstname)) {
//         //     return res.status(rescode.c5001.httpStatusCode).json({
//         //         code: rescode.c5001.businessCode,
//         //         message: rescode.c5001.description,
//         //         timeReq: dateTimeFormater(new Date(), 'x'),
//         //         catch: 'Invalid request body',
//         //     });
//         // }

//         const result = await Team.Addteam(data, formattedDateTime);

//         res.status(rescode.c1000.httpStatusCode).json({
//             code: rescode.c1000.businessCode,
//             message: rescode.c1000.description,
//             error: rescode.c1000.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//             data: result,
//         });
//     } catch (error) {
//         res.status(rescode.c5001.httpStatusCode).json({
//             code: rescode.c5001.businessCode,
//             message: rescode.c5001.description,
//             error: rescode.c5001.error,
//             timeReq: dateTimeFormater(new Date(), 'x'),
//             catch: error.message,
//         });
//     }
// };

const AddTeamUser = async function (req, res) {
    let formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');

    try {
        const data = [req.body.team_name, req.body.user_id]
        console.log("🚀 ~ AddTeamUser ~ data:", data)

        const result = await Team.Addteam(data, formattedDateTime);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
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

const EditTeamUser = async function (req, res) {
    try {
        const formattedDateTime = dateTimeFormater(new Date(), 'yyyy-MM-DD HH:mm:ss');
        const teamID = req.params.teamID;
        const data = req.body;

        const result = await Team.EditTeam(data, teamID, formattedDateTime);
        res.status(200).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
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

const DeleteTeamUser = async function (req, res) {
    try {
        const { teamId } = req.body; 

        if (!teamId) {
            return res.status(rescode.c4000.httpStatusCode).json({
                code: rescode.c4000.businessCode,
                message: rescode.c4000.description,
                error: rescode.c4000.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
                catch: 'Invalid request parameters',
            });
        }

        const result = await Team.DeleteTeam(teamId);
        await Team.ReorganizeTeamIDs(teamId);

        res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
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

const disableTeam =  async function (req, res) {
    let params = [req.body.team_status, req.body.team_id]
    try {
        var status = await Team.statusTeam(params)
        res.status(200).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            data: 'success',
        });
    } catch (error) {
        res.status(rescode.c1103.httpStatusCode).json({
            code: rescode.c1103.businessCode,
            message: rescode.c1103.description,
            error: rescode.c1103.error,
            timeReq: dateTimeFormater(new Date(), 'x'),
            catch: error.message,
        })

    }
};

const checkTeam = async function (req, res)  {
    try {
        const CheckTeam = req.body.team_name;
        console.log("🚀 ~ checkUsername ~ username:", CheckTeam)
        const existingTeam = await Team.checkByTeam(CheckTeam);
        if (existingTeam) {
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

module.exports = { MainTeamUser, AddTeamUser, EditTeamUser, DeleteTeamUser , disableTeam, checkTeam};

