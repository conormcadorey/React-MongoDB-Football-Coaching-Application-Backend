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
            userId: req.user //get current users id 
        });

        const savedMatch =  await newMatch.save();
        res.json(savedMatch);

    } catch {
        res.status(500).json({ msg : "Save failed, please try again!" });
    }
});

//GET ALL MATCHS
router.get("/allmatches", async (req, res) => {
    const matches = await Match.find();
    res.json(matches);
}); 

module.exports = router; 