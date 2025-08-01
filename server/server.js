import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app.js';
import { handleConnection } from './websockets/handler.js';

//Define the port for the server
const PORT = process.env.PORT || 8080;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  handleConnection(ws, wss);
});


// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
