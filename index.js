const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://tasksDB:6EQ6HHsculQPckva@cluster1.gnm5d1v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("tasksDB");
    const taskCollection = database.collection("taskDB");

    //  get :: show-all-task
    app.get("/api/v1/show-all-task", async (req, res) => {
      let query = {};
      if (req.query.userEmail) {
        query = { userEmail: req.query.userEmail };
      }
      console.log(req.query.userEmail);
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-task", async (req, res) => {
      const task = req.body;
      console.log(task);
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    // get :: show-task
    app.get("/api/v1/:taskId/show-task", async (req, res) => {
      const taskId = req.params.taskId;
      const query = { _id: new ObjectId(taskId) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    //  delete :: delete task
    app.delete("/api/v1/:taskId/delete-task", async (req, res) => {
      const taskId = req.params.taskId;
      const query = { _id: new ObjectId(taskId) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
    //  patch :: edit-task
    app.patch("/api/v1/:taskId/edit-task", async (req, res) => {
      const taskData = req.body;
      const taskId = req.params.taskId;
      const query = { _id: new ObjectId(taskId) };
      const editTask = {
        $set: {
          title: taskData.title,
          category: taskData.category,
          date: taskData.date,
          description: taskData.description,
          userEmail: taskData.userEmail,
        },
      };
      const result = await taskCollection.updateOne(query, editTask);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});

// tasksDB
// 6EQ6HHsculQPckva
