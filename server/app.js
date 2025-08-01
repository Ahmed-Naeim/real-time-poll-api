import express from 'express';

//Create and configure the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Export the app for use in other modules
export default app;
