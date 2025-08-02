import { get } from 'http';
import {getPoll, addVote} from '../poll/poll.js';

//This function will be called for each new WebSocket connection
export async function handleConnection (ws, wss) {
  console.log("Client is Connected");

  // Send the current poll data to the newly connected client
  ws.send(JSON.stringify({
    type: 'POLL_UPDATE',
    payload: await getPoll()
  }));

  //Handle incoming messages from the client (votes)
  ws.on('message', async (rawMessage) => {
    // console.log(`Received message: ${message}`);
    try{
      // Convert the raw message to a string first to avoid JSON parsing errors and buffer issues
      const message = JSON.parse(rawMessage.toString());

      if(message.type === 'VOTE') {

        const {name, option} = message.payload;

        const voteSuccessful = await addVote(option);

        if (voteSuccessful) {
          console.log(`📥 ${name} voted for: ${option}`);

          // Get the latest poll data after the vote
          const pollData = await getPoll();

          const announcementPayload = {
            name: name,
            optionText: pollData.options[option]
          };

          // Broadcast to all connected clients
          wss.clients.forEach(client => {
            if (client.readyState === 1) { // 1 means OPEN
              client.send(JSON.stringify({
                type: 'VOTE_ANNOUNCEMENT',
                payload: announcementPayload
              }));

              client.send(JSON.stringify({
                type: 'POLL_UPDATE',
                payload: pollData
              }));
            }
          });
        }
      }
    }
    catch (error) {
      console.error("Error parsing message:", error);
      return;
    }

  });

  //Handle the close event when the client disconnects
  ws.on('close', () => {
    console.log("Client is Disconnected");
  });
};
