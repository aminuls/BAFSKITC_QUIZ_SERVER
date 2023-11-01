const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;
const app = express();
// middleware
app.use(express.json());
app.use(cors());

// test
app.get("/", (req, res) => {
   res.send("Server is running");
});

// finally main code start--->
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});
async function run() {
   try {
      await client.connect();
      const itcDB = client.db("bafskitc");
      const questionsCollection = itcDB.collection("questions");
      const answersCollection = itcDB.collection("all_answers");
      const usersCollection = itcDB.collection("users");

      app.get("/questions", async (req, res) => {
         const query = {};
         const cursor = questionsCollection.find(query);
         const result = await cursor.toArray();
         res.send(result);
      });
      app.post("/users", async (req, res) => {
         const user = req.body;
         console.log(user);
         const result = await usersCollection.insertOne(user);
         res.send(result);
      });
      app.post("/answer", async (req, res) => {
         const answer = req.body;
         console.log(answer);
         const result = await answersCollection.insertOne(answer);
         res.send(result);
      });
      app.get("/answer", async (req, res) => {
         const query = {};
         const options = { projection: { _id: 0, details: {email: 1} } };
         const cursor = answersCollection.find(query, options)
         const result = await cursor.toArray();
         res.send(result )
      });
   } finally {
      // await client.close();
   }
}
run().catch((err) => console.log(err));
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
