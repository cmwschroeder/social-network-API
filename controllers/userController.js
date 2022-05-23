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
        } catch(err) {
            res.status(500).json(err);
        }
    }
}