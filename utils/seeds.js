const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing thoughts
    await Thought.deleteMany({});

    // Drop existing users
    await User.deleteMany({});

    const initThought = {
        thoughtText: 'Cool Stuff',
        username: 'CoolUser',
        reactions: [{
            reactionBody: 'Like',
            username: "OtherUser",
        },
        {
            reactionBody: 'Super Like',
            username: "AnotherUser",
        }],
    }

    await Thought.collection.insertOne(initThought);

    const coolUser = {
        username: 'CoolUser',
        email: 'cooluser@email.com',
        thoughts: [initThought._id],
        friends: [],
    };

    await User.collection.insertOne(coolUser);

    await User.collection.insertOne({
        username: 'OtherUser',
        email: 'otheruser@email.com',
        friends: [coolUser._id],
        thoughts: [],
    });

    process.exit(0);

});