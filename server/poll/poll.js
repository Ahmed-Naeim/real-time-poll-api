//acting like models in database

const pollData = {
  question: 'What is your favorite programming language?',
  options: {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    csharp: 'C#'
  },
  votes: {
    javascript: 0,
    python: 0,
    java: 0,
    csharp: 0
  }
};

export const getPoll = () => {
  return pollData;
};

export const addVote = (option) => {
  // Check if the option valid before adding a vote
  if (pollData.options[option]) {
    pollData.votes[option]++;
    return true; // Vote added successfully
  }
  return false; // Invalid option
}