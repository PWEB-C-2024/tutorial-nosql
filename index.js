require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

// URI strings can be retrieved after creating an MongoDB Atlas clusters. e.g. : mongodb+srv://[DB_USER]:[DB_PASSWORD]@[DB_HOSTNAME]/?retryWrites=true&w=majority&appName=[APP_NAME]
// Put URI strings on the .env file and make sure to exclude .env file in .gitignore
// Call the URI with process.env.[ARGS] that you set on .env file
const uri = process.env.MONGODB_URI;

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
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    // Use below function to ping the connection
    await checkConnection();

    // Hierarchical term in MongoDB regarding to it's database structures are Clusters > Databases > Collections > Dociments
    // Other NoSQL databases might use the same hierarchical pattern but different term
    const database = client.db("sample_mflix");
    const collection = database.collection("users");

    // Create Document
    await createItem(collection, {
      name: "Anu",
      email: "anu@gmail.com",
      password: "anu",
    });

    // Read Document
    await readItem(collection, { email: "anu@gmail.com" });

    // Update Document
    await updateItem(
      collection,
      { email: "anu@gmail.com" },
      { $set: { name: "update anu" } }
    );

    // Delete Document
    await deleteItem(collection, { email: "anu@gmail.com" });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function checkConnection() {
  try {
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  }
}

async function createItem(collection, item) {
  try {
    const result = await collection.insertOne(item);
    console.log(`Created item with _id: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  }
}

async function readItem(collection, filter) {
  try {
    const result = await collection.findOne(filter);
    console.log(`Found item: ${JSON.stringify(result)}`);
  } catch (err) {
    console.error(err);
  }
}

async function updateItem(collection, filter, update) {
  try {
    const result = await collection.updateOne(filter, update);
    console.log(`Updated ${result.modifiedCount} item(s)`);
  } catch (err) {
    console.error(err);
  }
}

async function deleteItem(collection, filter) {
  try {
    const result = await collection.deleteOne(filter);
    console.log(`Deleted ${result.deletedCount} item(s)`);
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
