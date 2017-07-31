const mongoose = require('mongoose');

const mongoURL = process.env.DEV_DB_URL;
const mongoURI = "mongodb://" + process.env.DEV_DB_CREDENTIALS + mongoURL;

// Only have one connection so use .connect
mongoose.connect(mongoURI);

const db = mongoose.connection

// error message
db.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
}); 

// disconnection message
db.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
});

// close mongoDB connection if app is exiting
function cleanUp() {  
    db.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
} 

// linux exit codes that will invoke clean-up
process.on('SIGINT', cleanUp);
process.on('SIGTERM', cleanUp);
