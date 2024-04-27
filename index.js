const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

// middleware area
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./hadith_db.db");

// Route to get all chapter
app.get("/chapter", (req, res) => {
  const sql = "SELECT * FROM chapter";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/hadiths", (req, res) => {
  const query = `
      SELECT h.*, s.title AS section_title, s.preface, s.number AS section_number, c.title AS chapter_title, c.number AS chapter_number
      FROM hadith h
      INNER JOIN section s ON h.section_id = s.section_id
      INNER JOIN chapter c ON h.chapter_id = c.chapter_id
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(rows);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
