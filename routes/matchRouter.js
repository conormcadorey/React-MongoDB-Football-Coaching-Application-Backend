const router = require("express").Router();
const auth = require("../middleware/auth");
const Match = require("../models/matchModel");

//SAVE COMPLETED MATCH
router.post("/submitmatch", auth, async (req, res) => {
    try {
        const { myTeam, oppTeam, myGoals, oppGoals, homeAway, complete, duration } = req.body;
        //validation
        if (!myTeam) {
            return res.status(400)
            .json({ msg: "Enter your team!" });
        }

        const newMatch = new Match({ 
            myTeam,
            oppTeam,
            myGoals,
            oppGoals,
            homeAway,
            complete,
            duration,
            userId: req.user
        });

        const savedMatch =  await newMatch.save();
        res.json(savedMatch);

    } catch {
        res.status(500).json({ msg : "Save failed, please try again!" });
    }
});

//SAVE A FUTURE MATCH 
router.post("/saveforlater", auth, async (req, res) => {
    try {
        const {myTeam, oppTeam, homeAway, complete} = req.body;

        if (!oppTeam) {
            return res.status(400)
            .json({ msg: "Enter your opposition!" });
        }

        const futureMatch = new Match({
            myTeam,
            oppTeam,
            homeAway,
            complete,
            userId: req.user 
        });

        const savedMatch = await futureMatch.save();
        res.json(savedMatch);
    } catch {
        res.status(500).json({ msg : "Match could not be saved for later, please try again!"});
    }
})

//GET ALL MATCHES
router.get("/allmatches", async (req, res) => {
    const matches = await Match.find();
    res.json(matches);
}); 

module.exports = router; 