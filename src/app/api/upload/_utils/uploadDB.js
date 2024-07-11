import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { awsConfig } from "../../../../../utils/auth";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export default async function uploadDB(
    user_id,
    created_at,
    title,
    description,
    flashcard_set_id,
    is_shadow
) {
    try {
        const audioPutCommand = new PutCommand({
            TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
            Item: {
                user_id: user_id,
                title: title,
                description: description,
                flashcard_set_id: flashcard_set_id,
                created_at: created_at,
                is_shadow: is_shadow,
            },
        });
        const audioRes = docClient.send(audioPutCommand);

        const flashcardsPutCommand = new PutCommand({
            TableName: process.env.AWS_DYNAMO_DB_FLASHCARDS_TABLE_NAME,
            Item: {
                flashcard_set_id: flashcard_set_id,
                title: title,
                created_at: created_at,
            },
        });
        const flashcardsRes = docClient.send(flashcardsPutCommand);

        await audioRes;
        await flashcardsRes;

        return { message: `uploaded successfully to db` };
    } catch (err) {
        return { error: `Failed to upload to db` };
    }
}
