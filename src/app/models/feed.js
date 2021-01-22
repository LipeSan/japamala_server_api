const mongoose = require('../../database');

const FeedSchema = new mongoose.Schema({
    title:{
        type: String,
        requiredPaths:true
    },
    pathImage:{
        type:String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type:Date,
        default: Date.now,
    },
    updatedAt: {
        type:Date,
        default: Date.now,
    },
});

const Feed = mongoose.model('Feed', FeedSchema);
module.exports = Feed;