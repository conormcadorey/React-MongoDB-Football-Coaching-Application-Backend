const router = require("express").Router();
const auth = require("../middleware/auth");
const Match = require("../models/matchModel");

function upperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

        let opposition = upperCase(oppTeam);

        const futureMatch = new Match({
            myTeam,
            opposition,
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
router.get("/allmatches/:myTeam", async (req, res) => {
    const matches = await Match.find({"myTeam": req.params.myTeam, complete: "Y"});
    res.json(matches);
}); 

//GET ALL UPCOMING MATCHES
router.get("/upcomingmatches/:myTeam", async (req, res) => {
    const matches = await Match.find({"myTeam": req.params.myTeam, complete: "N"});
        res.json(matches);
}); 


module.exports = router; 

//DELETE MATCH
router.delete("/delete/:id", auth, async (req, res) => {
    const match = await Match.findOne({userId: req.user, _id: req.params.id});
    if (!match)
        return res.status(400).json({ msg: "Match not found!" });
    //if verified
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);
        res.json(deletedMatch);
});

//DELETE UPCOMING MATCH ON INITIATION
router.delete("/replace/:id", auth, async (req, res) => {
    const match = await Match.findOne({_id: req.params.id});
    if (!match)
        return res.status(400).json({ msg: "Match not found!" });
    //if verified
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);
        res.json(deletedMatch);
});
