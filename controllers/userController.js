const { User, Thought } = require('../models');

module.exports = {
    //function that will get all users in db
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that will get the specific user in the db based on the id passed in, gives all info on this users thoughts
    //and friends
    async getSingleUser(req, res) {
        try{
            //get user by id
            const user = await User.find({_id: req.params.id});
            if(user.length === 0) {
                res.json("User not found");
            }else {
                //create an object that we will return 
                const singleUser = {
                    id: user[0]._id,
                    username: user[0].username,
                    email: user[0].email,
                    friendCount: user[0].friendCount,
                    thoughts: [],
                    friends: [],
                };
                //loop through all thoughts, we have the id but not the thought so we need to get the info about the thought
                for(let i = 0; i < user[0].thoughts.length; i++) {
                    //get thought from db based on id
                    const thought = await Thought.find({_id: user[0].thoughts[i]});
                    //add it to our object that we will be returning
                    singleUser.thoughts.push(thought);
                }
                //same thing we did with the thoughts but with the friend list of this user
                for(let i = 0; i < user[0].friends.length; i++) {
                    //get user info based off of their id
                    const friend = await User.find({_id: user[0].friends[i]});
                    //add to our friends array that we are returning
                    singleUser.friends.push(friend);
                }
                res.json(singleUser);
            }
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that takes in request body containing username and email and creates a new user
    async createUser (req, res) {
        try {
            //create a new user based off of the passed in username and email
            await User.collection.insertOne({
                username: req.body.username,
                email: req.body.email,
                friends: [],
                thoughts: [],
            });
            //tell requester that it was added
            res.json("User added");
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that takes in username and email and updates the user who's id was also passed in
    async updateUser (req, res) {
        try {
            //find the user based on its id, set its data to the data in request body, return new user info
            const user = await User.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            res.json(user);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //function that deletes a user based on its id, also deletes all thoughts that the user has in the db
    async deleteUser (req, res) {
        try {
            //get user based on id
            const user = await User.find({ _id: req.params.id });
            //check to see that user exists
            if(user.length != 0) {
                //delete thoughts that have the username of this user
                await Thought.deleteMany({ username: user[0].username });
                //delete the user
                await User.findOneAndDelete({ _id: req.params.id });
                //tell the requester that the user was deleted
                res.json('User Deleted')
            }
            else {
                res.json('User Not Found')
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
}