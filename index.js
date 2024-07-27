const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.json({
  limit: "50mb"
}));
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

app.all("/", (req, res) => {
  res.render("pages/index.ejs", {
    images: JSON.parse(fs.readFileSync("./db.json", "utf8") || "[]") || []
  });
});

app.post("/api/v1/addImage", (req, res) => {
  fs.writeFileSync("./db.json", JSON.stringify({
    ...JSON.parse(fs.readFileSync("./db.json", "utf8") || "[]") || [],
    ...[
      req.body
    ]
  }), "utf8");
});

const listen = app.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
});