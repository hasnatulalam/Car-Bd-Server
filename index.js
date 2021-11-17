const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vx1yr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("car");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const userCollection = database.collection("users");

    //put user to the db
    app.put("/users", async(req,res) => {
        const userData = req.body;
        const filter = {email: userData.email};
        const options = {upsert: true};
        const updatedUser = {
          $set: {...userData}
        }
        const result = await userCollection.updateOne(filter, updatedUser, options);
        res.json(result)
    })



    // get all users
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const allUser = await cursor.toArray();
      res.json(allUser);
    });

    //update user role to admin
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const roleUpdate = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(
        filter,
        roleUpdate,
        options
      );
      res.json(result);
    });

    //get products
    app.get("/products", async (req, res) => {
      const limit = +req.query.limit;
      let result;
      if (limit) {
          result = await productCollection
              .find({})
              .sort({ _id: -1 })
              .limit(limit)
              .toArray();
      } else {
          result = await productCollection.find({}).sort({ _id: -1 }).toArray();
      }
      res.json(result);
  });

    // get a single product
    app.get("/products/:productid", async (req, res) => {
      const productid = req.params.productid;
      const query = { _id: ObjectId(productid) };
      const product = await productCollection.findOne(query);
      console.log("load user with id", product);
      res.send(product);
    });

    //Confirm order
    app.post("/placeorder", async (req, res) => {
      const orderProduct = req.body;
      const result = await orderCollection.insertOne(orderProduct);
      console.log("order placed", req.body);
      console.log("successfully ordered", result);
      res.json(result);
    });

    //get all review
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //add user review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log("review added", req.body);
      console.log("successfully added review", result);
      res.json(result);
    });

    //get all order
    app.get("/allorder", async (req, res) => {
      const cursor = orderCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
    });

    // check admin role 
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.json({ admin: isAdmin })
  })


    // get my orders
    app.get("/myorders/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // delete a single order
    app.delete("/allorder/:id", async (req, res) => {
      const id = req.params.id;
      console.log("deleted id ", id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // delete a single product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("deleted id ", id);
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });

    // add a product
    app.post("/addproduct", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log("got new product", req.body);
      console.log("successfully added product", result);
      res.json(result);
    });

    //update order status
    app.put("/allorder/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.body);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const productUpdate = {
        $set: {
          status: "shipped",
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        productUpdate,
        options
      );
      res.json(result);
    });

    console.log("connected to Car Bd database");
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Car Bd Server..");
});

app.listen(port, () => {
  console.log("Listening to Car Bd server on", port);
});
