const mongoose = require('mongoose');

const mongoURL = process.env.DEV_DB_URL;
const mongoURI = "mongodb://" + process.env.DEV_DB_CREDENTIALS + mongoURL;

mongoose.connect(mongoURI);

const db = mongoose.connection

db.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
}); 

db.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
});

function cleanUp() {  
    db.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
} 

process.on('SIGINT', cleanUp);
process.on('SIGTERM', cleanUp);
