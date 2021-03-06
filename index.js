const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hs8ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("E-Pustok database connected");
    const database = client.db("folders");
    const writersCollection = database.collection("writers");
    const booksCollection = database.collection("books");

    // Post Document

    app.post("/writers", async (req, res) => {
      const writer = req.body;
      const pic = req.files.image;
      const picData = pic.data;
      const encodedImage = picData.toString("base64");
      const imageBuffer = Buffer.from(encodedImage, "base64");

      const writersData = {
        writer,
        image: imageBuffer,
      };

      const result = await writersCollection.insertOne(writersData);
      res.json(result);
    });

    app.post("/books", async (req, res) => {
      const book = req.body;
      const pic = req.files.image;
      const picData = pic.data;
      const encodedImage = picData.toString("base64");
      const imageBuffer = Buffer.from(encodedImage, "base64");

      const booksData = {
        book,
        image: imageBuffer,
      };

      const result = await booksCollection.insertOne(booksData);
      res.json(result);
    });

    // Get Document

    app.get("/writers", async (req, res) => {
      const cursor = writersCollection.find({});
      const writers = await cursor.toArray();
      res.json(writers);
    });

    app.get("/books", async (req, res) => {
      const cursor = booksCollection.find({});
      const books = await cursor.toArray();
      res.json(books);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const books = await booksCollection.findOne(query);
      res.json(books);
    });

    
    // End
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running E-Pustok Server");
});

app.listen(port, () => {
  console.log(`Running E-Pustok server on link http://localhost:5000`);
});
