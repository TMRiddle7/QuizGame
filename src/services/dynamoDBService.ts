import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const getQuestions = async () => {
  const params = {
    TableName: "QuizQueTable"
  };

  try {
    const data = await client.send(new ScanCommand(params));
    console.log(data);
     return data;
    //return data.Items.map(item => unmarshall(item).Questions).flat();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getPlayerScore = async (QuizID: string, PlayerID: string) => {
  const params = {
    TableName: "QuizTable",
    Key: marshall({ QuizID, PlayerID })
  };

  try {
    const data = await client.send(new GetItemCommand(params));
    return data.Item ? unmarshall(data.Item) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updatePlayerScore = async (QuizID: string, PlayerID: string, score: { correct: number, wrong: number, unanswered: number }) => {
  const params = {
    TableName: "QuizTable",
    Item: marshall({ QuizID, PlayerID, ...score })
  };

  try {
    await client.send(new PutItemCommand(params));
  } catch (err) {
    console.error(err);
  }
};