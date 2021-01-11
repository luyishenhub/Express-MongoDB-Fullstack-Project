const express = require('express');
const cors = require('cors');
const app = express();

//contains all the origins the server is willing to accpet
const whitelist = ['http://localhost:3000', 'https://localhost:3443']; 
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    console.log("NancyYYYY")
    console.log(corsOptions.origin);
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);