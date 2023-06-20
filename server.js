// common const setups that will likely be used to get the app to work
const express = require("express");
const path = require("path");
const  fs = require("fs");

const PORT = process.env.port || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware to serve up static assets from the public folder
app.use(express.static("public"));

// GET route for the homepage
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET route for notes page
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET route to read the db.json file and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile("/db/db.json").then((data) => res.json(JSON.parse(data)));
});


