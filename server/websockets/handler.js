import { get } from 'http';
import {getPoll, addVote} from '../poll/poll.js';

//This function will be called for each new WebSocket connection
export const handleConnection = (ws, wss) => {
  console.log("Client is Connected");

  // Send the current poll data to the newly connected client
  ws.send(JSON.stringify({
    type: 'POLL_UPDATE',
    payload: getPoll()
  }));

  //Handle incoming messages from the client (votes)
  ws.on('message', (rawMessage) => {
    // console.log(`Received message: ${message}`);

    try{
      // Convert the raw message to a string first to avoid JSON parsing errors and buffer issues
      const message = JSON.parse(rawMessage.toString());

      if(message.type !== 'VOTE') {
        console.error("Invalid message type. Expected 'VOTE'.");
        return;
      }

      const {name, option} = message.payload;

      if (name && option && getPoll().options[option]) {
        console.log(`📥 ${name} voted for: ${option}`);
        addVote(option);

        const poll = getPoll();
        const announcementPayload = {
          name: name,
          optionText: poll.options[option] // This will be the readable text, e.g., "JavaScript"
        };

        console.log("Broadcasting announcement:", announcementPayload); // <-- Add here


        const pollUpdatePayload = getPoll();

        // Broadcast the updated poll and vote announcement to all connected clients
        wss.clients.forEach(client => {
          if (client.readyState === 1) { // 1 means OPEN
            client.send(JSON.stringify({
              type: 'VOTE_ANNOUNCEMENT', 
              payload: announcementPayload
          }));

            client.send(JSON.stringify({
              type: 'POLL_UPDATE', 
              payload: pollUpdatePayload
            }));
          }
        });
      }
      else {
        console.error("Invalid message format. Expected {name, option}");
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

