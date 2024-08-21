import { DynamoDBClient, ScanCommand ,PutItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';


const client = new DynamoDBClient({ region: "us-east-1" });


export const getQuizzes = async () => {
  const url = 'https://9u3h498vg4.execute-api.us-east-1.amazonaws.com/getQuiz';
  try {
    const response = await axios.get(url);
    const quizzes = response.data.map((item) => ({
      QuizID: item.QuizID.S,
      category: item.Category.S,
    }));
    return (quizzes); // Return the actual data
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const getQues = async (quizID) => {
  const url = 'https://9u3h498vg4.execute-api.us-east-1.amazonaws.com/getQue'
  const data = {
    quizId : 'Quiz1'
  };
  const fullUrl = `${url}?quizId=${quizID}`;
  try{
    const response = await axios.get(fullUrl);
    return response.data;
  }
  catch (error){
    console.error('Error in fetch questions:',error);
    throw error;
  }
}

export const submitScore = async (quizID, Correct, total) => {
  const url = 'https://9u3h498vg4.execute-api.us-east-1.amazonaws.com/submitScore'
  const data = {
    quizId : quizID,
    PlayerID: localStorage.getItem('playerUsername'),
    correct: Correct,
    total: total,
  };
  try{
    const response = await axios.post(url,data);
    return response.data;
  }
  catch (error){
    console.error('Error in fetch questions:',error);
    throw error;
  }
}


export const getScores = async() =>{
  const url = 'https://9u3h498vg4.execute-api.us-east-1.amazonaws.com/getScore'
  
  try{
    const response = await axios.get(url);
    return response.data
  }
  catch (error){
    console.error('Error in fetch questions:',error);
    throw error;
  }
}


export const addNewQuiz = async (quizID, category, questions) => {
  const url = 'https://9u3h498vg4.execute-api.us-east-1.amazonaws.com/addNewQuiz'; 

  const data = {
    quizId: quizID,
    category: category,
    questions: questions
  };

  try {
    const response = await axios.post(url, data);
    return response.data; // Return the response data from the API
  } catch (error) {
    console.error('Error adding new quiz:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}
