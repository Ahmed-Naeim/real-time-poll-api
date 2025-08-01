import { WebSocket } from "ws";

// The WebSocket server URL
const wsUrl = "ws://localhost:8000";

//Create a new WebSocket Instance
const ws = new WebSocket(wsUrl);


function displayPoll (pollData){
  console.clear();
  console.log('----- Real-time Poll -----');
  console.log(`Question: ${pollData.question}\n`);

  // Display the results
  console.log('Results:');
  for (const key in pollData.options) {
    const voteCount = pollData.votes[key];
    const optionText = pollData.options[key];
    console.log(`- ${optionText}: ${voteCount} votes`);
  }
  console.log('\n----------------------------------');
  console.log('To vote, type the option key (e.g., "javascript") and press Enter.');
}



// Event listener for when the connection is opened
ws.on("open", () => {
  console.log("Connected to WebSocket server, waiting for poll data...");

  // // Send a message to the server (for testing purposes)
  // const message = "Hello from the client!";
  // ws.send(message);
  // console.log(`Sent message: ${message}`);
});

//Event listener for receiving messages from the server
ws.on("message", (message) => {

  //Convert the message from JSON string to JavaScript object
  const pollData = JSON.parse(message);
  // Display the poll data
  displayPoll(pollData);
});

// Listen for user input to send votes from the terminal
process.stdin.on("data", (data) => {
  // Convert the input to a string and trim whitespace
  const vote = data.toString().trim();
  ws.send(vote);
  console.log(`Sent vote for: ${vote}`);
});

// Event listener for when the connection is closed
ws.on("close", () => {
  console.log("Disconnected from WebSocket server");
});

// Event listener for errors
ws.on("error", (error) => {
  console.error(`WebSocket error: ${error.message}`);
});