const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl =
  "mongodb+srv://anjanivaranasi123:Bw4ZX6Fr8pgUmgZq@cluster0.rgb7b1h.mongodb.net/test";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = "aid-chain";

async function connectToMongoDB() {
  console.log("Establishing connection to MongoDB Atlas...");
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    console.error(e);
  }
}

app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server listening on port ${port}`);
});

app.get("/", async (req, res) => {
  //   const db = await client.db(database);
  //   const collection = db.collection("test");

  //   // Insert a document
  //   await collection.insertOne({ name: "John Doe", age: 30 }, (err, result) => {
  //     if (err) {
  //       console.log("Error inserting document", err);
  //       return;
  //     }

  //     console.log("Document inserted successfully:", result.insertedId);
  //   });
  res.send("API/Backend is working!!");
});

// write a app.get function to get total number of documents in a collection. the route is /getAllMetadata

app.get("/getAllMetadata", async (req, res) => {
  const db = client.db(database);
  let collection = db.collection("products");
  const productCount = await collection.countDocuments();
  collection = db.collection("orgs");
  const orgCount = await collection.countDocuments();
  collection = db.collection("sFacilities");
  const sFacilityCount = await collection.countDocuments();
  collection = db.collection("distributors");
  const distributorCount = await collection.countDocuments();
  res.status(200).send({
    productCount: productCount,
    orgCount: orgCount,
    sFacilityCount: sFacilityCount,
    distributorCount: distributorCount,
  });
});

// write a app.get function to get all documents in a collection. the route is /getProducts

app.get("/getProducts", async (req, res) => {
  const db = await client.db(database);
  const collection = db.collection("products");
  const products = await collection.find().toArray();
  res.status(200).send(products);
});

// write a app.post function to add a document to a collection. the route is /registerProduct

app.post("/registerProduct", async (req, res) => {
  console.log("<< Register Product Called  >>");
  const db = await client.db(database);
  const collection = db.collection("products");
  const product = {
    pName: req.body.pName,
    pQuantity: req.body.pQuantity,
    dName: req.body.dName,
    date: req.body.date,
    mNo: req.body.mNo,
    account: req.body.account,
    productId: req.body.productId,
    productStatus: req.body.productStatus.toString(),
    orgCode: req.body.orgCode,
    sFacilityCode: req.body.sFacilityCode,
    distributorCode: req.body.distributorCode,
  };

  // need to insert a document with following values -   pName, pQuantity, dName, mNo, account, productId obtained from req.body
  try {
    await collection.insertOne(product);
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

// write a app.get function to fetch a document from a collection specified with an product ID. the route is /getProduct

app.get("/getProduct", async (req, res) => {
  const db = await client.db(database);
  const collection = db.collection("products");
  const productId = req.query.productId;

  try {
    const product = await collection.findOne({ productId: productId });
    res.status(200).send({ success: true, product: product });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

// write a app.post function to register an organization. the route is /registerOrg

app.post("/registerOrg", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("orgs");
  const org = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    type: req.body.type,
    account: req.body.account,
    orgId: req.body.orgId,
  };

  try {
    await collection.insertOne(org);
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

// write a app.post function to login an organization. the route is /loginOrg

app.post("/loginOrg", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("orgs");
  const org = {
    username: req.body.username,
    password: req.body.password,
    account: req.body.account,
  };

  try {
    const orgFound = await collection.findOne(org);
    if (orgFound) {
      res.status(200).send({ success: true, org: orgFound });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Invalid login credentials" });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error logging in" });
  }
});

app.get("/getAllProducts", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("products");

  try {
    const products = await collection.find().toArray();
    res.status(200).send({ success: true, products });
  } catch (e) {
    res
      .status(400)
      .send({ success: false, message: "Error retrieving products" });
  }
});

app.post("/approveOrDenyProduct", async (req, res) => {
  console.log("<< Approve Product Called >>", req.body);
  const db = client.db(database);
  const collection = db.collection("products");

  const pid = req.body.productId;

  if (req.body.statusCode === "1" || req.body.statusCode === "11") {
    console.log("<< Approve Product Called for ORG >>");
    try {
      const updateResult = await collection.updateOne(
        { productId: parseInt(pid) },
        {
          $set: {
            productStatus: req.body.statusCode,
            orgCode: req.body.fromCode,
          },
        }
      );

      if (updateResult.modifiedCount === 1) {
        res.status(200).send("Product status updated successfully");
      } else {
        res
          .status(400)
          .send(
            "Error updating product status [1]",
            updateResult.modifiedCount
          );
      }
    } catch (error) {
      res
        .status(400)
        .send("Error updating product status [2]", { error: error });
    }
  } else if (req.body.statusCode === "2" || req.body.statusCode === "22") {
    console.log("<< Approve Product Called for SF >>");
    try {
      const updateResult = await collection.updateOne(
        { productId: parseInt(pid) },
        {
          $set: {
            productStatus: req.body.statusCode,
            sFacilityCode: req.body.fromCode,
            distributorCode: req.body.toCode,
          },
        }
      );

      if (updateResult.modifiedCount === 1) {
        res.status(200).send("Product status updated successfully");
      } else {
        res.status(400).send("Error updating product status [1]");
      }
    } catch (error) {
      res.status(400).send("Error updating product status [2]");
    }
  } else if (req.body.statusCode === "3" || req.body.statusCode === "33") {
    console.log("<< Approve Product Called for Distributor >>");
    try {
      const updateResult = await collection.updateOne(
        { productId: parseInt(pid) },
        {
          $set: {
            productStatus: req.body.statusCode,
          },
        }
      );

      if (updateResult.modifiedCount === 1) {
        res.status(200).send("Product status updated successfully");
      } else {
        res.status(400).send("Error updating product status [1]");
      }
    } catch (error) {
      res.status(400).send("Error updating product status [2]");
    }
  }
});

app.post("/registersSFacility", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("sFacilities");
  const org = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    account: req.body.account,
    orgId: req.body.orgId,
  };

  try {
    await collection.insertOne(org);
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

app.post("/loginSFacility", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("sFacilities");
  const org = {
    username: req.body.username,
    password: req.body.password,
    account: req.body.account,
  };

  try {
    const orgFound = await collection.findOne(org);
    if (orgFound) {
      res.status(200).send({ success: true, org: orgFound });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Invalid login credentials" });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error logging in" });
  }
});

app.post("/registerDistributor", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("distributors");
  const org = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    type: req.body.type,
    area: req.body.area,
    account: req.body.account,
    orgId: req.body.orgId,
  };

  try {
    await collection.insertOne(org);
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

app.post("/loginDistributor", async (req, res) => {
  const db = client.db(database);
  const collection = db.collection("distributors");
  const org = {
    username: req.body.username,
    password: req.body.password,
    account: req.body.account,
  };

  try {
    const orgFound = await collection.findOne(org);
    if (orgFound) {
      res.status(200).send({ success: true, org: orgFound });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Invalid login credentials" });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error logging in" });
  }
});
