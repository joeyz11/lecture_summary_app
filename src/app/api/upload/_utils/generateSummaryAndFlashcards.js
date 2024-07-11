import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    GetCommand,
    UpdateCommand,
    DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { awsConfig } from "../../../../../utils/auth";
import { convertTimestampTextToTranscription } from "../../../../../utils/utils";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export default async function generateSummaryAndFlashcards(
    user_id,
    created_at,
    flashcard_set_id
) {
    try {
        // 1. get vtt from db
        const audioGetCommand = new GetCommand({
            TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
            Key: {
                user_id: user_id,
                created_at: created_at,
            },
            ProjectionExpression: "vtt",
        });
        let audioRes = await docClient.send(audioGetCommand);
        const vtt = audioRes.Item.vtt;

        // 2. tranform to transcription using convertTimestampTextToTranscription
        const transcript = convertTimestampTextToTranscription(vtt);

        // 3. call openai to generate summary and flashcards
        const summary = "test_summary";
        const flashcards = [
            ["q1", "a1"],
            ["q2", "a2"],
            ["q3", "a3"],
        ];

        // 4. update summary in db
        const audioUpdateCommand = new UpdateCommand({
            TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
            Key: {
                user_id: user_id,
                created_at: created_at,
            },
            UpdateExpression: "SET #summary = :summary",
            ExpressionAttributeNames: {
                "#summary": "summary",
            },
            ExpressionAttributeValues: {
                ":summary": summary,
            },
        });
        await docClient.send(audioUpdateCommand);

        // 5. update flashcards in db
        const flashcardsUpdateCommand = new UpdateCommand({
            TableName: process.env.AWS_DYNAMO_DB_FLASHCARDS_TABLE_NAME,
            Key: {
                flashcard_set_id: flashcard_set_id,
                created_at: created_at,
            },
            UpdateExpression: "SET #question_answer_set = :question_answer_set",
            ExpressionAttributeNames: {
                "#question_answer_set": "question_answer_set",
            },
            ExpressionAttributeValues: {
                ":question_answer_set": flashcards,
            },
        });
        await docClient.send(flashcardsUpdateCommand);

        console.log("success generate summary and flashcards");
        return { message: `generated and uploaded successfully to db` };
    } catch (err) {
        console.log("generate summary and flashcards error", err);
        return { error: `Failed to query ${err}` };
    }
}
