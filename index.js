const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkn0m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('db connected')
        const partsCollection = client.db("manufacturer").collection("parts");
        const orderCollection = client.db("manufacturer").collection("orders");
        const reviewCollection = client.db("manufacturer").collection("review");

        app.get('/parts', async (req, res) => {
            const parts = await partsCollection.find({}).toArray()
            res.send(parts)
        })
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const part = await partsCollection.findOne(query)
            res.send(part)
        })

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const orders = await orderCollection.find(query).toArray()
            res.send(orders)
        })

        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

        // getting reviews 
        app.get('/review', async (req, res) => {
            const review = await reviewCollection.find({}).toArray()
            res.send(review)
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })


    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Manufacturers server')
})

app.listen(port, () => {
    console.log(`Listening to Manufacturers Server ${port}`)
})

