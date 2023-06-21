// common const setups that will likely be used to get the app to work
const express = require("express");
const path = require("path");
const  fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.port || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware to serve up static assets from the public folder
app.use(express.static("public"));


// GET route for notes page
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// GET route to read the db.json file and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// GET route for the homepage
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);

    try {
        // Read the existing notes from the db.json file
        const notes = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8"));

        // Create a new note object with a unique ID using uuidv4()
        const newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text,
        };

        // Add the new note to the existing notes array
        notes.push(newNote);

        // Write the updated notes array back to the db.json file
        fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(notes));
        
        // Respond with the new note as JSON
        res.json(newNote);
    } catch (error) {
        console.error("Error occurred while saving the note:", error);
        res.status(500).json({ error: "Failed to save the note." });
      }
});

app.delete("/api/notes/:id", (req, res) => {
    console.info(`${req.method} request received to delete a note`);
  
    try {
      // Read the existing notes from the db.json file
      const notes = JSON.parse(
        fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8")
      );
  
      // Find the index of the note with the provided ID
      const noteIndex = notes.findIndex((note) => note.id === req.params.id);
  
      if (noteIndex === -1) {
        // If the note with the provided ID is not found, return a 404 status
        return res.status(404).json({ error: "Note not found." });
      }
  
      // Remove the note from the notes array using the index
      const deletedNote = notes.splice(noteIndex, 1)[0];
  
      // Write the updated notes array back to the db.json file
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notes)
      );
  
      // Respond with the deleted note as JSON
      res.json(deletedNote);
    } catch (error) {
      console.error("Error occurred while deleting the note:", error);
      res.status(500).json({ error: "Failed to delete the note." });
    }
  });
  

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
