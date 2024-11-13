const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { client } = require("./db");
client.connect();
// Use CORS middleware
app.use(cors());
app.use(express.json());
app.use("/api", require("./api"));
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});
app.listen(port, () => console.log(`listening on port ${port}`));
