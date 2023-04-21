const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

let notesData = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// HTML Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API Routes
app.get("/api/notes", (req, res) => {
  try {
    notesData = fs.readFileSync("./db/db.json", "utf8");
    notesData = JSON.parse(notesData);
  } catch (err) {
    console.error(err);
  }
  res.json(notesData);
});

app.post("/api/notes", (req, res) => {
  try {
    notesData = fs.readFileSync("./db/db.json", "utf8");
    notesData = JSON.parse(notesData);
    req.body.id = notesData.length;
    notesData.push(req.body);
    notesData = JSON.stringify(notesData);
    fs.writeFile("./db/db.json", notesData, "utf8", (err) => {
      if (err) throw err;
      res.json(true);
    });
  } catch (err) {
    console.error(err);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  try {
    notesData = fs.readFileSync("./db/db.json", "utf8");
    notesData = JSON.parse(notesData);
    notesData = notesData.filter((note) => note.id != req.params.id);
    notesData = JSON.stringify(notesData);
    fs.writeFile("./db/db.json", notesData, "utf8", (err) => {
      if (err) throw err;
      res.json(true);
    });
  } catch (err) {
    console.error(err);
  }
});

// Start server to begin listening
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
