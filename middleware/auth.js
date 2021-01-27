const jwt = require("jsonwebtoken");

//X-auth process to verify a user 

//3 auth function params = req, res and next
//next() is an empty function that simply prompts the next process
const auth = (req, res, next) => {
    try { 
        //get token from request header
        //const token = req.header("x-auth-token"); 
        const token = req.header("Authorization"); 
        //validation- check if token exists
        if (!token)
            return res.status(401)
            .json({ msg: "No Auth token, authorisation denied!" });
        //match token against .env password
        //pass decoded jwt object in verified variable on success
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.status(401)
            .json({ msg: "Token verification failed, authorisation denied!" });
        //on success
        //assign verified id to user header 
        req.user = verified.id;
        next(); //execute next function 
        } catch (err) {
            res.status(500).json({ error: err.message });
    }
};

module.exports = auth; 