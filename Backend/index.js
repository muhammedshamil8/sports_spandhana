const express = require("express");
const { db } = require("./firebase");
const cors = require("cors");
const app = express();
// ✅ Allow requests from any domain
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// GET all todos from Firebase Firestore
app.get("/", async (req, res) =>
{
  try {
    res.status(201).json({message: "Kalart Backend is Running"})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/todos", async (req, res) => {
  try {
    const snapshot = await db.collection("todos").get();
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/results", async (req, res) => {
  try {
      const snapshot = await db.collection("programResults").get();
      if (snapshot.empty) {
          console.log("No documents found in 'programResults'");
      }
      const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log("Fetched results:", todos); // Log fetched data
      res.json(todos);
  } catch (error) {
      console.error("Firestore error:", error);
      res.status(500).json({ error: error.message });
  }
});


// POST a new todo to Firestore
app.post("/todos", async (req, res) => {
  try {
    const newTodo = { task: req.body.task, completed: false };
    const docRef = await db.collection("todos").add(newTodo);
    res.status(201).json({ id: docRef.id, ...newTodo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});