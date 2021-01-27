const router = require("express").Router();
const auth = require("../middleware/auth");
const Player = require("../models/playerModel");

//CREATE PLAYER
router.post("/", auth, async (req, res) => {
    try {
        const { name, position, number } = req.body;
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
    //query for all players linked the current uid
    const players = await Player.find();
    //response with array of relevent players
    res.json(players);
}); 

//GET ALL PLAYERS USING AUTH MIDDLEWARE 
router.get("/allauth", auth, async (req, res) => {
    //query for all players linked the current uid
    const players = await Player.find();
    //response with array of relevent players
    res.json(players);
}); 

/*
router.get("/all", auth, async (req, res) => {
    //query for all players linked the current uid
    const players = await Player.find({ userId: req.user });
    //response with array of relevent players
    res.json(players);
}); 
*/

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

//TEST ROUTE

module.exports = router; 

