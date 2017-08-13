const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchHistory = new Schema({
    gameId: Number,
    queue: Number,
    season: Number,
    timeStamp: Number,
});

// add summoner model to the mongoose object. Allows this model to be accessed via the mongoose object.
const MatchHistory = mongoose.model('MatchListData', matchHistory);
