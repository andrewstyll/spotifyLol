const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const summoner = new Schema({
    profileIconId: Number,
    name: String,
    accountId: Number,
    id: Number,
    revisionDate: Number,
    updateScheduled: String // day/month/year format
});

// add summoner model to the mongoose object. Allows this model to be accessed via the mongoose object.
const Summoner = mongoose.model('Summoner', summoner);
