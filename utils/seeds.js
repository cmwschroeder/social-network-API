const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing thoughts
    await Thought.deleteMany({});

    // Drop existing users
    await User.deleteMany({});

    await Thought.collection.insertOne({
        thoughtText: 'Cool Stuff',
        username: 'User',
        reactions: [{
            reactionBody: 'Like',
            username: "OtherUser",
        },
        {
            reactionBody: 'Super Like',
            username: "AnotherUser",
        }],
    });

    process.exit(0);

});