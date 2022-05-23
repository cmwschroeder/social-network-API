const { User, Thought } = require('../models');

module.exports = {
    //function that will get all thoughts in the db
    async getThoughts(req, res) {
        try {
            //use find to get all thoughts
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that will get a single thought based on its id
    async getSingleThought(req, res) {
        try {
            //use find with the param id to get a thought
            const thought = await Thought.find({ _id: req.params.id });
            res.json(thought);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that creates a thought in the db with the given body
    async createThought(req, res) {
        try {
            const user = await User.find({ _id: req.body.userId });
            if(user.length != 0) {
                //create a new thought based off of the passed in text and username
                const thought = {
                    thoughtText: req.body.thoughtText,
                    username: req.body.username,
                    reactions: [],
                }
                //insert thought into db
                await Thought.collection.insertOne(thought);
                //add this thought to the thought array in the user's model
                await User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thought._id } },
                    { runValidators: true, new: true }
                );
                //return the created thought
                res.json(thought);
            }
            else {
                res.json("User not found");
            }
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    //function that updates a thought in the db with the given body
    //a thought will only update its text, not its user
    async updateThought(req, res) {
        try {
            //find the user based on its id, set its data to the data in request body, return new user info
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            res.json(thought);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that deletes the thought from db matching the given id
    async deleteThought(req, res) {
        try {
            //first get the thought so that we can remove it from the user's thoughts
            const thought = await Thought.find({ _id: req.params.id });
            if(thought.length != 0) {
                //remove the thought from the users thought array
                await User.updateOne(
                    { username: thought[0].username},
                    { $pullAll: { thoughts: [thought[0]._id] }},
                    { runValidators: true, new: true }
                );
                //delete the thought
                await Thought.findOneAndDelete({ _id: req.params.id });
                //tell the requester the thought was deleted
                res.json("Thought deleted");
            } else {
                res.json("Thought not found");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
}