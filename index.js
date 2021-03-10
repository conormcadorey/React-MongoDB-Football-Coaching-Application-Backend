//this file starts up when server code runs
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //cross origin resource sharing
require("dotenv").config(); //environment vars in .env file

//set up express
//create new express app
const app = express();
//middlewear to interact with express routes
//json body parser to read json objects from res sent by express 
app.use(express.json()); 

app.use(cors());

const PORT = process.env.PORT || 5000; 
//start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//connects to mongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, 
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, 
    (err) => {
        if (err) throw err;
        console.log("MongoDB Connection ESTABLISHED");
});

//build routes
//when on users path, require the userRouter.js middlewear
app.use("/users", require("./routes/userRouter"));
app.use("/players", require("./routes/playerRouter"));
app.use("/match", require("./routes/matchRouter"));
