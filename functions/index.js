const express = require("express");

const app = express();

const functions = require("firebase-functions");

app.use(require("./routes/station.routes"));

exports.app = functions.https.onRequest(app);
