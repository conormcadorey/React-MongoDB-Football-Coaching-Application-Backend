const mongoose = require("mongoose");

//Create a new player 

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    position: {
        type: String
    },
    number: {
        type: Number
    },
    team: {
        type: String,
        required: true
    },
    //ID of user creating the player - not the player ID!
    userId: {
        type: String,
        required: true
    }
    }, {
      timestamps: true,
});

module.exports = Player = mongoose.model("Player", playerSchema);