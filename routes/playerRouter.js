const router = require("express").Router();
const auth = require("../middleware/auth");
const Player = require("../models/playerModel");

//CREATE PLAYER
router.post("/", auth, async (req, res) => {
    try {
        const { name, position, number, team } = req.body;
        //validation
        if (!name) 
            return res.status(400).json({ msg: "Please enter a player name" });
        if (name.length < 3)
            return res.status(400).json({ msg: "Name must be at least 3 characters long"});
        /*if (!position)
            return res.status(400).json({ msg: "Please enter the players main position"});
        if (!number)
            return res.status(400).json({ msg : "Please enter a player number"});
        if (number.toString().length > 3)
            return res.status(400).json({ msg : "Please enter a number between 1 - 3 digits"});*/

        //create new player object and save to DB
        const newPlayer = new Player({
            name,
            position,
            number,
            team,
            userId: req.user, //get current users id from the request
        });
        const savedPlayer = await newPlayer.save();
        res.json(savedPlayer);

    } catch (err) {
        res.status(500).json({ error : err.message });
    }
});

//GET ALL PLAYERS INFO
router.get("/all", async (req, res) => {
    const players = await Player.find();
    res.json(players);
}); 

//GET ALL PLAYERS USING AUTH MIDDLEWARE 
router.get("/allauth/:myTeam", auth, async (req, res) => {
    const players = await Player.find({'team': req.params.myTeam});
    if (players.length === 0) {
        return res.status(400).json({ msg: "No players!" });
    } else {
        res.json(players);
    }
}); 

//DELETE PLAYER
router.delete("/delete/:id", auth, async (req, res) => {
    //verify user id
    //verify param id (id of player to be deleted)
    const player = await Player.findOne({userId: req.user, _id: req.params.id});
    if (!player)
        return res.status(400).json({ msg: "Player not found!" });
    //if verified
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
        res.json(deletedPlayer);
});

//EDIT PLAYER NAME
router.put("/editname/:id", auth, async (req, res) => {
    const updatedPlayer = await Player
    .findById(req.params.id)
    .then(player=> {
        player.name = req.body.name;

        player
        .save()
        .then(() => res.json(player.name))
        .catch(err => res.status(400).json({ msg: "There was a problem, please try again"}))
        
    })
    .catch(err => res.status(400).json({ msg: "Player not found!"}))
});

//EDIT PLAYER POSITION
router.put("/editposition/:id", auth, async (req, res) => {
    const updatedPlayer = await Player
    .findById(req.params.id)
    .then(player=> {
        player.position = req.body.position;

        player
        .save()
        .then(() => res.json(player.position))
        .catch(err => res.status(400).json({ msg: "There was a problem, please try again"}))
        
    })
    .catch(err => res.status(400).json({ msg: "Player not found!"}))
});

//EDIT PLAYER NUMBER
router.put("/editnumber/:id", auth, async (req, res) => {
    const updatedPlayer = await Player
    .findById(req.params.id)
    .then(player=> {
        player.number = req.body.number;

        player
        .save()
        .then(() => res.json(player.number))
        .catch(err => res.status(400).json({ msg: "There was a problem, please try again"}))
        
    })
    .catch(err => res.status(400).json({ msg: "Player not found!"}))
});

module.exports = router; 

