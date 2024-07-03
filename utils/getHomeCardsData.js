import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const docClient = DynamoDBDocumentClient.from(client);

export default async function getHomeCardsData(user_id) {
    const audioQueryCommand = new QueryCommand({
        TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id,
        },
        ProjectionExpression:
            "title, description, flashcard_set_id, created_at",
        ScanIndexForward: false,
    });
    const audioRes = await docClient.send(audioQueryCommand);

    return audioRes.Items;
}
