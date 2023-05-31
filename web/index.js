// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";

// const PORT = parseInt(
//   process.env.BACKEND_PORT || process.env.PORT || "3000",
//   10
// );
const PORT = process.env.PORT || 3000;

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(cors());


app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "varientdb",
});


app.post("/varientdb", (req, res) => {
  const sql = "INSERT INTO subproducts (`product_id`,`product`,`subproductname`,`addprice`) VALUES (?)";
  const values = [
    req.body.product_id,
    req.body.productname,
    req.body.subproductname,
    req.body.addprice
  ]
  db.query(sql, [values], (err, data) => {
    if(err) {
        return res.json("Error");
    }
    return res.json(data);
})
})

app.get("/getproductsvarients", (req, res) => {

  const sql = "SELECT * FROM subproducts";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  })
});
app.get("/getvarientsdata", (req, res) => {

  const sql = "SELECT * FROM subproducts";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  })
});

app.get("/api/varient/:product_id",(req, res) => {

  const product_id = req.params.product_id;

  const sql = "SELECT * FROM subproducts WHERE product_id = ?";

  db.query(sql, [product_id], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  })
});

app.delete('/data/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM subproducts WHERE id = ?';

  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error deleting data:', error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

app.get('/getData', (req, res) => {
  db.query('SELECT * FROM subproducts', (err, results) => {
      if (err) throw err;
      res.send(results);
  });
});

app.delete('/deleteRow/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM subproducts WHERE id = ?', [id], (err, results) => {
      if (err) throw err;
      res.send({ message: 'Row deleted successfully!' });
  });
});

db.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});

app.listen(8081,() => {
  console.log("Server Running successfully on 8081");
});
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
// app.post(
//   shopify.config.webhooks.path,
//   shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
// );
app.post(
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);
// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/all", async (_req, res) => {
  const productlist = await shopify.api.rest.Product.all({
    // limit:250,
    session: res.locals.shopify.session,
  });
  // res.status(200).send(productlist);
  return res.json(productlist);
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
