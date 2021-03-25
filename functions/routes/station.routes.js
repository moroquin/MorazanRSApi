const { Router } = require("express");
const router = Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const { postToken, getToken } = require("../accesstoken");

//./morazanrsapi-firebase-adminsdk.json

admin.initializeApp({
  credential: admin.credential.cert("./morazanrsapi-firebase-adminsdk.json"),
});

const dataBase = admin.firestore();

/*
{
    "id": 4,
    "lecture": 28,
    "sensor_type": 2,
    "country": "gt",
    "id_station": 25,
    "datetime": "2021-03-24T19:39:41.276Z"
    "postToken": "post"
}
*/

/**
 * Necesita los siguientes parametros:
 * -lecture: lleva la lectura del sensor
 * -sensor_type: tipo de sensor (anemómetro, . . . )
 * -country: país
 * -id_station: id estación
 * -datetime: iso formatt
 */
router.post("/api/remoteStation", async (req, res) => {
  try {
    if (req.body.postToken === postToken) {
      await dataBase
        .collection("rstation")
        .doc("/" + req.body.id + "/")
        .create({
          lecture: req.body.lecture,
          sensor_type: req.body.sensor_type,
          country: req.body.country,
          id_station: req.body.id_station,
          datetime: req.body.datetime,
        });
      return res.status(200).json();
    } else {
      return res.status(403).send("No autorizado");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/api/remoteStation/:id", async (req, res) => {
  try {
    if (req.body.getToken === getToken) {
      const resp = dataBase.collection("rstation").doc(req.params.id);
      const item = await resp.get();
      return res.status(200).json(item.data());
    } else {
      return res.status(403).send("No autorizado");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/api/remoteStations", async (req, res) => {
  try {
    if (req.body.getToken === getToken) {
      const query = dataBase.collection("rstation");
      const querySnapshot = await query.get();
      const response = querySnapshot.docs.map((item) => ({
        lecure: item.data().lecture,
        sensor_type: item.data().sensor_type,
        country: item.data().country,
        id_station: item.data().id_station,
        datetime: item.data().datetime,
      }));
      return res.status(200).json(response);
    } else {
        return res.status(403).send("No autorizado");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
