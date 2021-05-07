const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    myTeam: {
        type: String
    },
    oppTeam: {
        type: String
    },
    opposition: {
        type: String
    },
    myGoals: {
        type: String
    },
    oppGoals: {
        type: String
    },
    homeAway: {
        type: Boolean
    },
    complete: {
        type: String
    },
    duration: {
        type: String
    }, 
    //ID of user creating the player - not the player ID!
    userId: {
        type: String
    }
    }, {
      timestamps: true,
});

module.exports = Match = mongoose.model("Match", matchSchema);