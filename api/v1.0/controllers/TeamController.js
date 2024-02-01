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
            teamID: item.teamid,
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

const AddTeamUser = async function (req, res) {
    try {
        const { teamName, userFirstNames } = req.body;

        if (!teamName || !userFirstNames || !Array.isArray(userFirstNames)) {
            return res.status(rescode.c4000.httpStatusCode).json({
                code: rescode.c4000.businessCode,
                message: rescode.c4000.description,
                error: rescode.c4000.error,
                timeReq: dateTimeFormater(new Date(), 'x'),
                catch: 'Invalid request body',
            });
        }

        const result = await Team.Addteam({ teamName, userFirstNames });

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
        const data = req.body; 
            const result = await Team.EditTeam(data);
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

module.exports = { MainTeamUser, AddTeamUser, EditTeamUser, DeleteTeamUser };

