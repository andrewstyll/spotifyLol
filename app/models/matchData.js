const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchData = new Schema({
    
});

// add matchhistory model to the mongoose object. Allows this model to be accessed via the mongoose object.
const MatchData = mongoose.model('MatchData', matchData);

