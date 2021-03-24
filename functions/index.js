const express = require("express");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const app = express();

const serviceAccount = require("./morazanrsapi-firebase-adminsdk.json");
const dataBase = admin.firestore();

admin.initializeApp({
  credential: admin.credential.cert("serviceAccount"),
});

app.post("/api/remoteStations", async (req, res) => {
    await dataBase
    .collection("station")
    .doc("/" + req.body.id + "/")
    .create({lecture: req.body.name,
            sensor: req.body.sensor});
    return res.status(200).json();
});

app.get("/hello-world", (req, res) => {
  return res.status(200).json({ message: "hola" });
});

exports.app = functions.https.onRequest(app);
