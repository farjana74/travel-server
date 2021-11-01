
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors');
// const ObjectId =require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2z78o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  

async function run() {
    try {
      await client.connect();
      const database = client.db("travel");
      const booking= client.db("booking");
      const manage = client.db('manage')
      const travelCollection = database.collection("services");
      const orderCollection = booking.collection('orders')
    //   const manageCollection =manage.collection('all')



       // create a document to insert(post api)

       app.post('/services',async(req,res)=>{
        const service = req.body;
        const result = await travelCollection.insertOne(service);
        console.log(result)
        res.json(result);
      })
// get api
app.get("/services",async(req,res)=>{
    const cursor = travelCollection.find({});
    const services = await cursor.toArray();
    res.json(services)
})

// get single service
app.get('/services/:id',async(req,res)=>{
    const id=req.params.id;
    const query = {_id:ObjectId(id)};
const service =await travelCollection.findOne(query);
res.json(service)
})


     
    // //   post manageOrder
    // app.get('/manageOrder',async(req,res)=>{
    //     const cursor =   manageCollection.find({})
    //     const manage = await cursor.toArray();
    //     res.json(manage);
    //     // console.log(result);
    // })


// post api for manageorder

app.get('/manageOrder',async(req,res)=>{
    const cursor = orderCollection.find({});
    const result= await cursor.toArray();
    res.send(result)
})





    //   get order api
      app.get("/orders/:email", async (req, res) => {
          const email =req.params.email;
        const result = await orderCollection.find({
           email
        }).toArray();
        res.send(result);
      });


    // add order api

    app.post('/myOrder',async(req,res)=>{
        const order = req.body;
       const result = await orderCollection.insertOne(order)
       console.log(result)
        res.json(result)

    })

    // delete api
    app.delete('/orders/:id',async(req,res)=>{
        const orderId =req.params.id;
        const query = {_id:ObjectId(orderId)};
        const result = await orderCollection.deleteOne(query)
        console.log('deleting user',result);
        res.json(result)

    })
    
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);








app.get('/',(req,res)=>{
    res.send('running travel agency')
})

app.listen(port,()=>{
console.log('travell agency',port)
})