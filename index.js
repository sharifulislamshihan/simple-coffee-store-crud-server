const express = require('express');
const cors = require('cors');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.COFFEE_DB_USER}:${process.env.COFFEE_DB_PASS}@cluster0.wsbi62n.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffee');
        
        // user collection
        const userCollection = client.db('coffeeDB').collection('user');

        // get operation (read)
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get operation for specific id
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })


        // post operation (Creat)
        app.post('/coffee', async (req, res) => {

            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        // put operation for update

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const options = {
                upsert: true
            };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    price: updatedCoffee.price,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        // delete operation (delete)
        app.delete('/coffee/:id', async (req, res) => {

            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("coffee store server is running")
})


app.listen(port, (req, res) => {
    console.log(`coffee store server running at port: ${port}`);
})