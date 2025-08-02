import db from '../database/connection.js';

const pollQuestion = 'What is your favorite programming language?';

// getPoll is now an async function that returns a promise
export async function getPoll () {
  return new Promise((resolve, reject) => {
    // Query the database to get all rows from the poll table
    db.all('SELECT * FROM poll', [], (err, rows) => {
      if (err) {
        console.error('Error fetching poll data:', err.message);
        reject(err);
      }
      // Map the rows to a more structured format (database rows to structured object)
      const pollData = {
        question: pollQuestion,
        options: {},
        votes: {}
      };

      rows.forEach(row => {
        pollData.options[row.option_key] = row.option_text;
        pollData.votes[row.option_key] = row.vote_count;
      });

      resolve(pollData);
      
    });
  });
};

export async function addVote (option) {
  return new Promise((resolve, reject) => {

    // Update the vote count for the specified option
    const sql = `UPDATE poll
                SET vote_count = vote_count + 1
                  WHERE option_key = ?`;
    
    // Run the update query
    db.run(sql, [option], function(err) {
      if(err){
        reject(err);
        return;
      }
      // This changes will be 1 if a row was updated, 0 otherwise
      resolve(this.changes > 0);
    });
  });
}