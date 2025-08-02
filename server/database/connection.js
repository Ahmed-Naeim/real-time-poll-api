import sqlite3 from 'sqlite3';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';
import e from 'express';


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

export default db;