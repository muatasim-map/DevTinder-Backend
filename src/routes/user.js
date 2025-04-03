const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');

const userRouter = express.Router();

const DATA = "_id firstName lastName profilePicture gender bio location age experienceLevel skills profileSummary education workExperience socialLinks";
//Get all pending requests 
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate({
            path: 'fromUserId',
            select: DATA
        });

        res.json({
            message: connectionRequests.length > 0 ? "Connection requests found" : "No requests found",
            data: connectionRequests,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server Error" + err.message,
        });
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate({
                path: 'fromUserId',
                select: DATA
            })
            .populate({
                path: 'toUserId',
                select: DATA
            });

        // Map the connections to get connected user data
        const connectedUsers = connections.map(connection => {
            // If fromUserId is logged in user, return toUser details, else return fromUser details
            const connectedUser = connection.fromUserId._id.equals(loggedInUser._id)
                ? connection.toUserId
                : connection.fromUserId;

            // Only include the specified fields
            const { _id, firstName, lastName, profilePicture, gender, bio, location, experienceLevel, skills, profileSummary, education, age, socialLinks, workExperience } = connectedUser;
            return {
                connectionId: connection._id,
                user: {
                    _id,
                    firstName,
                    lastName,
                    profilePicture,
                    gender,
                    bio,
                    age,
                    location,
                    experienceLevel,
                    skills,
                    profileSummary,
                    education,
                    socialLinks,
                    workExperience
                },
                status: connection.status,
            };
        });

        res.json({
            message: "Connected users fetched successfully",
            data: connectedUsers
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error" + err.message,
        });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    //not => his own card
    //not => already connected
    //not => already sent request
    //not => ignored
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 30 ? 30 : limit;
        const skip = (page - 1) * limit;

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("toUserId fromUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        hideUsersFromFeed.add(loggedInUser._id.toString());

        const feedUsers = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select(DATA)
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Feed users fetched successfully",
            data: feedUsers
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server Error: " + err.message,
        });
    }
})

module.exports = userRouter;