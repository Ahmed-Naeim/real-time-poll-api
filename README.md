# Real-Time Polling Application API

This project is a backend application for a real-time polling system, built with Node.js and WebSockets. It allows multiple clients to connect, view a poll, vote, and see results and announcements updated instantly for all connected users. The data is persisted in a SQLite database.

---

## 🚀 Key Features

* **Real-Time Updates**: Uses WebSockets (`ws`) for instant, two-way communication.
* **Live Broadcasting**: When a user votes, the updated results and an announcement are broadcast to all connected clients.
* **Database Persistence**: Poll results are stored in a SQLite database, so data is not lost when the server restarts.
* **Structured API**: Communicates using a clear JSON-based protocol with different message types.
* **Clean Architecture**: The server is organized with a clear separation of concerns for the server, data logic, and WebSocket handling.

---

## 🛠️ Technology Stack

* **Backend**: Node.js, Express.js
* **Real-Time Communication**: `ws` (WebSocket library)
* **Database**: SQLite3
* **Client**: Can be tested with the included Node.js CLI client or a WebSocket client like Postman.

---

## ⚙️ Setup and Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd real-time-poll-app
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Initialize the database:**
    This only needs to be run once to create the `poll.db` file and set up the table.
    ```sh
    node server/database/setup.js
    ```
4.  **Start the server:**
    ```sh
    npm start
    ```
    The server will be running at `ws://localhost:8080`.

---

## 📡 API Usage

The API communicates over WebSockets. Clients can connect to `ws://localhost:8080`.

### Messages from Client to Server

#### Casting a Vote

To cast a vote, the client must send a JSON message with the following structure:

* **Type**: `VOTE`
* **Payload**: An object containing the user's name and the chosen option key.

**Example:**
```json
{
  "type": "VOTE",
  "payload": {
    "name": "Alex",
    "option": "javascript"
  }
}
