const express = require("express");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

const app = express();
app.use(cors());

const dbName = "notifications";
const collectionName = "users";

app.use(express.json());

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  console.log(collectionName);
  const user = await collection.findOne({ user_name: username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  return res.status(200).json({ message: "Login successful", sucess: true });
});

const notification_collectionName = "notifications";

app.post("/add_notification", async (req, res) => {
  const { title, url, date } = req.body;
  console.log(title, url, date);

  if (!title || !url || !date) {
    return res
      .status(400)
      .json({ message: "Title, URL, and date are required" });
  }

  const db = client.db(dbName);
  const collection = db.collection(notification_collectionName);

  try {
    const existingNotification = await collection.findOne({ title, url, date });
    if (existingNotification) {
      return res.status(409).json({ message: "Notification already exists" });
    }

    const result = await collection.insertOne({ title, url, date });
    console.log("New notification created:", result);
    return res
      .status(201)
      .json({ message: "Notification created successfully" });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/notifications", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection(notification_collectionName);

  try {
    const notifications = await collection.find({}).toArray();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(notification_collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Notification deleted successfully" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
