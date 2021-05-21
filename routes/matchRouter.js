const router = require("express").Router();
const e = require("express");
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

//GET MATCHES LENGTH
router.get("/length/:myTeam", async (req, res) => {
    const matches = await Match.find({"myTeam": req.params.myTeam, complete: "Y"});
    res.json(matches.length);
}); 

//GET MATCHES WON
router.get("/wins/:myTeam", async (req, res) => {
    const matches = await Match.find({"myTeam": req.params.myTeam, $expr:{$gt:["$myGoals", "$oppGoals"]}});
    res.json(matches.length);
}); 

//GET MATCHES LOST
router.get("/losses/:myTeam", async (req, res) => {
    const matches = await Match.find({"myTeam": req.params.myTeam, $expr:{$gt:["$oppGoals", "$myGoals"]}});
    res.json(matches.length);
}); 

//GET MATCHES DRAWN
router.get("/draws/:myTeam", async (req, res) => {
    const matches = await Match.find({"myTeam": req.params.myTeam, complete: "Y", $expr:{$eq:["$myGoals" , "$oppGoals"]}});
    res.json(matches.length);
}); 

//PAGINATION COMPLETED MATCHES
router.get("/completed/:myTeam", async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const matches = {}

    //next results
    
    if (endIndex < await Match.countDocuments().exec()) {
    matches.next = {
        page: page + 1,
        limit: limit
        }
    }
    //previous results
    if (startIndex > 0) {
    matches.previous = {
        page: page - 1,
        limit: limit
        }
    }
    
    try {
        matches.results = await Match.find({"myTeam": req.params.myTeam, complete: "Y"}).sort({ createdAt: 'desc' }).limit(limit).skip(startIndex).exec()
        res.paginatedResults = matches
        res.json(matches)
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
});

//PAGINATION UPCOMING MATCHES
router.get("/paginate/:myTeam", async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const matches = {}

    //next results
    
    if (endIndex < await Match.countDocuments().exec()) {
    matches.next = {
        page: page + 1,
        limit: limit
        }
    }
    //previous results
    if (startIndex > 0) {
    matches.previous = {
        page: page - 1,
        limit: limit
        }
    }
    
    try {
        matches.results = await Match.find({"myTeam": req.params.myTeam, complete: "N"}).sort({ createdAt: 'desc' }).limit(limit).skip(startIndex).exec()
        res.paginatedResults = matches
        res.json(matches)
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
});

//UPDATE MATCH SCORE
router.put("/editmatch/:id", auth, async (req, res) => {
    const updatedScore = await Match
    .findById(req.params.id)
    .then(match=> {
        match.myGoals = req.body.myGoals,
        match.oppGoals = req.body.oppGoals;
  
        match
        .save()
        .then(() => res.json(updatedScore))
        .catch(err => res.status(400).json({ msg: "There was a problem, please try again"}))
        
    })
    .catch(err => res.status(400).json({ msg: "User not found!"}))
  });

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

module.exports = router; 
