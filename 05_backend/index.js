// External dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");

// App Setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Importing the routers
const authRouter = require("./routers/authRouter");
const commentRouter = require("./routers/commentRouter");
const pageRouter = require("./routers/pageRouter");
const userRouter = require("./routers/userRouter");

// Routes
app.use("/auth", authRouter);

app.use("/page", pageRouter);

app.use("/pages", commentRouter);

app.use("/users", userRouter);

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