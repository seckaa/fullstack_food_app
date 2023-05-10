const router = require('express').Router();
const admin = require('firebase-admin');

//default route for api users
router.get("/", (req, res) =>{
return res.send("Inside the user Router");
});

//Verification route
router.get("/jwtVerification", async(req, res) => {
    // return res.send("jwt Verification");//for testing 
    if(!req.headers.authorization){
        return res.status(500).send({msg : "Token not found"});
    }
    const token = req.headers.authorization.split(" ")[1];
    // return res.status(200).send({token : token});
    try {
       const decodedValue = await admin.auth().verifyIdToken(token);
        if(!decodedValue){
            return res
            .status(500)
            .json({ success: false, msg: "Unathorized access"});
        }
        return res
        .status(200)
        .json({ success: true, data: decodedValue});
    } catch (err) {
        return res.send({
            success: false,
            msg: `Error in extracting token : ${err}`,
        });
    }
});

module.exports = router;