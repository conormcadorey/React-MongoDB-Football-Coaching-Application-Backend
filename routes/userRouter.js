const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

//REGISTER USER ROUTE
//configure router
router.post("/register", async (req, res) => {
    try {
      //get data from the body of the POST req
      //json body parser automatically parses string to json object 
      let { email, password, passwordCheck, userName } = req.body; 
      
      //validation 
      if (!email || !password || !passwordCheck || !userName)
        return res.status(400).json({ msg: "Please complete all fields!"});
      if (password.length < 8)
        return res.status(400).json({ msg: "Password must be at least 8 characters long!"});
      if (password !== passwordCheck)
        return res.status(400).json({ msg: "Please check your passwords match!"});
  
      //DB query using userModel to check if new email matches an existing email 
      const existingUser = await User.findOne({email: email})
        //if existingUser does not return null = email already registered
        if (existingUser)
          return res.status(400).json({ msg: "Email already registered!"});
  
        //if (!userName) userName = email; //if username null = use email 

        //encrypt new user password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
  
      //create and save new user object to DB
      const newUser = new User({
        email,
        password: passwordHash,
        userName
      });
        const savedUser = await newUser.save(); 
        res.json(savedUser); 

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  //LOGIN USER ROUTE
  router.post("/login", async (req, res) => {
    try {
      //extract email/pass from req body
      const { email, password } = req.body;
  
      //validation
      if (!email || !password) {
        return res.status(400).json({ msg: "Please complete all fields!"});
      }
      //check that user exists in DB by querying submitted email 
      const user = await User.findOne({ email: email }); 
      if (!user) {
        return res.status(400)
        .json({ msg: "Account not found!"});
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400)
        .json({ msg: "Invalid login details!"});
      }
  
      //jwt token stores user info, verification info, token expiry etc
      //assign token id from DB uid
      //verify token authenticity with password from .env
      //dont use users own pwd, as json tokens can be easily decoded
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
      res.json({
        token,
        user: {
          id: user._id,
          userName: user.userName,
        },
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//DELETE ACCOUNT ROUTE
//private route- validate user using jwt token and middlewear
router.delete("/delete", auth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//BOOLEAN TOKEN VALIDATOR
//use this endpoint to help verify if user is valid and has a token
//use to help display frontend buttons/features depending on logged in status 
router.post("/tokenIsValid", async (req, res) => {
    try {
      //if no token, return false
      const token = req.header("x-auth-token"); 
      if (!token) return res.json(false);
      //if token not verified, return false 
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
      //if token valid but the user doesn't exist, return false 
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
      //else return true
      return res.json(true);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//GET CURRENT LOGGED IN USER DETAILS
router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
      displayName: user.displayName,
      id: user._id,
    });
  });

module.exports = router;