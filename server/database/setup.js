import sqlite3 from 'sqlite3';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'polls.db');

// Open a database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// poll table creation
const initialPoll = {
  question: 'What is your favorite programming language?',
  options: {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    csharp: 'C#'
  }
};

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS poll (
      option_key TEXT PRIMARY KEY NOT NULL,
      option_text TEXT NOT NULL,
      vote_count INTEGER NOT NULL DEFAULT 0
    )
  `, (err) => {
    if (err) return console.error("Error creating table:", err.message);
    console.log('Table "poll" is ready.');
  });

  // Prepare an instance statement
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO poll (option_key, option_text, vote_count)
    VALUES (?, ?, ?)
  `);


  // Insert initial poll into the table
  for(const key in initialPoll.options){
    stmt.run(key, initialPoll.options[key], 0, (err) => {
      if (err) {
        console.error('Error inserting initial poll option:', err.message);
      } else {
        console.log(`Inserted option: ${key}`);
      }
    });
  }


});
