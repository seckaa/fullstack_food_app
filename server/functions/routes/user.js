const router = require('express').Router();
const admin = require('firebase-admin');
let data = [];

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

const listAllUsers = async (nextPageToken) => {
    // List batch of users, 1000 at a time.
    admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((rec) => {
          data.push(rec.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  };
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();

  router.get("/all", async(req, res) => {
    listAllUsers();
    try {
        return res
         .status(200)
         .send({success: true, data: data, dataCount: data.length});
    } catch (err) {
        return res.send({
            success: false,
            msg: `Error is listing users :, ${err}`,
        });
    }
  });

module.exports = router;

//43
