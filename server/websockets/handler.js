import {getPoll, addVote} from '../poll/poll.js';

//This function will be called for each new WebSocket connection
export const handleConnection = (ws, wss) => {
  console.log("Client is Connected");

  // Send the current poll data to the newly connected client
  ws.send(JSON.stringify(getPoll()));

  //Handle incoming messages from the client (votes)
  ws.on('message', (message) => {
    // console.log(`Received message: ${message}`);

    //Convert the message to a string, as it can be a buffer
    const voteOption = message.toString();

    console.log(`Received vote for: ${voteOption}`);

    // Add the vote using the addVote function
    addVote(voteOption);

    // After adding the vote, send the updated poll data to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) { // 1 means OPEN
        client.send(JSON.stringify(getPoll()));
      }
    });


  });

  //Handle the close event when the client disconnects
  ws.on('close', () => {
    console.log("Client is Disconnected");
  });
};

