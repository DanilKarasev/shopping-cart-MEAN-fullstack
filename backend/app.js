const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.get("/", (req, res) => {
  res.status(200).send("Hello server is running").end();
});

//Load models
const List = require("./db/models/list.model");
const Good = require("./db/models/good.model");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  next();
});

//ROUTE HANDLERS

//LIST ROUTES
//=====================================================
/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get("/lists", (req, res) => {
  //Return an array of shop lists
  List.find({}).then((lists) => {
    res.send(lists);
  });
});
/**
 * POST /lists
 * Purpose: Add a new list and update
 */
app.post("/lists", (req, res) => {
  //Return an array of shop lists
  const newList = new List({
    title: req.body.title,
  });

  newList.save().then((listDoc) => {
    //full list document
    res.send(listDoc);
  });
});

app.patch("/lists/:listId", (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.listId },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Updated successfully." });
  });
});

app.delete("/lists/:listId", (req, res) => {
  // We want to delete the specified list (document with id in the URL)
  List.findOneAndRemove({ _id: req.params.listId }).then((removedListDoc) => {
    res.send(removedListDoc);
    deleteGoodsFromList(removedListDoc._id);
  });
});

const deleteGoodsFromList = (_listId) => {
  Good.deleteMany({
    _listId,
  }).then(() => {
    console.log("Tasks from " + _listId + " were deleted!");
  });
};

//GOODS ROUTES
//=====================================================
app.get("/goods", (req, res) => {
  //return all goods
  Good.find({}).then((goods) => {
    res.send(goods);
  });
});

app.get("/lists/:listId/goods", (req, res) => {
  //return all goods of a specific list
  Good.find({
    _listId: req.params.listId,
  }).then((goods) => {
    res.send(goods);
  });
});

app.post("/lists/:listId/goods", (req, res) => {
  //Add a new good to a list
  const newGood = new Good({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newGood.save().then((newGoodDoc) => {
    res.send(newGoodDoc);
  });
});

app.patch("/lists/:listId/goods/:goodId", (req, res) => {
  Good.findOneAndUpdate(
    {
      _listId: req.params.listId,
      _id: req.params.goodId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Updated successfully." });
  });
});

app.delete("/lists/:listId/goods/:goodId", (req, res) => {
  // We want to delete the specific good
  Good.findOneAndRemove({
    _listId: req.params.listId,
    _id: req.params.goodId,
  }).then((removedGoodDoc) => {
    res.send(removedGoodDoc);
  });
});

app.delete("/lists/:listId/goods", (req, res) => {
  // We want to delete the specific good
  Good.deleteMany({
    _listId: req.params.listId,
  }).then((removedGoodsDoc) => {
    res.send(removedGoodsDoc);
  });
});
