const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sauth", require("./routes/signupAuth"))
app.use("/api/notes", require("./routes/notes"));
app.use("/api/fpauth", require("./routes/forgotPassAuth"))
app.use("/api/dauth", require("./routes/deleteAccountRoute"))
app.use("/api/confirmauth", require("./routes/confirmLoginRoute"))

app.listen(port, () => {
  console.log(`iNotebook app listening on http://localhost:${port}`);
});
