const express = require("express");
const bodyparser = require("body-parser");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:false }))

const password = "mernuser mernpassword";

const uri = "mongodb+srv://mernuser:mernpassword@cluster0.ka9ky.mongodb.net/merndbst?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("merndbst").collection("items");

  app.get("/users",(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get("/user/:id",(req,res)=>{
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.post("/add",(req,res)=>{
    const add = req.body;
    collection.insertOne(add)
    .then(function(result) {
      console.log("new data added on database")
      res.redirect("/")
    })
  })

  app.patch("/update/:id",(req,res)=>
  {
    collection.updateOne({_id:ObjectId(req.params.id)},
      { 
        $set: { price:req.body.price , quantity:req.body.quantity }
      })
    .then(function(result) {
      res.send( result.modifiedCount > 0 )
    })
  })

  app.delete("/delete/:id",(req,res)=>{
    console.log(req.params.id)
    collection.deleteOne({ 
      _id:ObjectId(req.params.id)
    })
    .then(function(result) {
      res.send(result.deletedCount > 0)
    })
  })


});


app.get("/",(req,res) => {
    res.sendFile(__dirname + "/index.html")
})


app.listen(3200,console.log("succesfully called port : 3200"))

