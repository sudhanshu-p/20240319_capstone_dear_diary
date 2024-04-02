// External dependencies
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./dear-diary-21bce-firebase-adminsdk-v7wvf-3228d4151f.json");

const verifyToken = require('./helpers/helperFunctions.js')
const User = require('./models/User.js')

// App Setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    
});


// creating a testing api to store the fcm token in mongo


// app.post('/storeToken',verifyToken,async(req,res)=>{
//     const fmcToken = req.body.fmcToken
//     const user = req.body.userId
//     try {
//         // Update the user and return the updated document
//         const updatedUser = await User.findByIdAndUpdate(user, { fmcToken: fmcToken }, { new: true });
    
//         // If the user with the given ID doesn't exist, handle it appropriately
//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
    
//         // Send the updated user data in the response
//         res.status(200).json({ message: "Token stored", user: updatedUser });
//     } catch (error) {
//         // Handle any errors that occur during the update or retrieval process
//         console.error(error);
//         res.status(500).json({ message: "An error occurred" });
//     }




    
// })

// creating a testing api to give notification 
app.post('/sendToDevice', function (req, res) {
    const token = req.body.token;
    

    admin.messaging().send({
        token: token,
        notification: {
          title: 'Token Validation',
          body: 'This is a dummy message to validate token.',
        },
      })
      .then((response) => {
        // Token is valid
        console.log('Successfully sent message:', response);
        res.send(response)
      })
      .catch((error) => {
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          // Token is invalid or expired
          console.log('The token is invalid or expired:', error);
        } else {
          // Other errors
          console.log('Error sending message:', error);
        }
      });
})


// Importing the routers
const authRouter = require("./routers/authRouter");
const commentRouter = require("./routers/commentRouter");
const pageRouter = require("./routers/pageRouter");
const userRouter = require("./routers/userRouter");
const followRouter = require("./routers/followRouter")

// Routes
app.use("/auth", authRouter);

app.use("/page", pageRouter);

app.use("/pages", commentRouter);

app.use("/users", userRouter);


app.use('/users',followRouter)

// Connect to MongoDB

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        startServer();
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

const startServer = () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

connectToMongoDB();