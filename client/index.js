import { WebSocket } from "ws";


//Get the username from the command line arguments
const userName = process.argv[2] || "Anonymous";

// The WebSocket server URL
const wsUrl = "ws://localhost:8080";

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
  console.log(`Hi, ${userName}, To vote, type the option key (e.g., "javascript") and press Enter.`);
}



// Event listener for when the connection is opened
ws.on("open", () => {
  console.log(`Connected to WebSocket server, as ${userName}.`);

  // // Send a message to the server (for testing purposes)
  // const message = "Hello from the client!";
  // ws.send(message);
  // console.log(`Sent message: ${message}`);
});

//Event listener for receiving messages from the server
ws.on("message", (rawMessage) => {

  // Parse the incoming message
  const message = JSON.parse(rawMessage.toString());

  // Switch to handle different message types
  switch (message.type) {
    case 'POLL_UPDATE':
      // Handle poll updates
      console.log("Poll updated:");
      displayPoll(message.payload);
      break;
    case 'VOTE_ANNOUNCEMENT':
      console.log("Received payload:", message.payload);
      // Handle vote announcements
      console.log("Vote announcement:");
      const { name, optionText } = message.payload;
      console.log(`\n📢 ${name} just voted for ${optionText}!\n`);
      break;
    default:
      console.error(`Unknown message type: ${message.type}`);
      break;
  }
});

// Listen for user input to send votes from the terminal
process.stdin.on("data", (data) => {
  // Convert the input to a string and trim whitespace
  const voteOption = data.toString().trim();

  // Construct the message to send
  const message = {
    type: 'VOTE',
    payload: {
      name: userName,
      option: voteOption
    }
  };

  // Send the JSON as a string to the WebSocket server
  ws.send(JSON.stringify(message));
});

// Event listener for when the connection is closed
ws.on("close", () => {
  console.log("Disconnected from WebSocket server");
});

// Event listener for errors
ws.on("error", (error) => {
  console.error(`WebSocket error: ${error.message}`);
});