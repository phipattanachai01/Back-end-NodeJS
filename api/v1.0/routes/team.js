const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');

router.post('/main', TeamController.MainTeamUser);
router.post('/addteam',TeamController.AddTeamUser);
router.post('/editteam/:teamID', TeamController.EditTeamUser);
router.post('/deleteteam', TeamController.DeleteTeamUser);


module.exports = router;
