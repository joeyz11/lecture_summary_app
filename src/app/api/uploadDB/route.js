import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(req) {
    const { user_id, title, description, flashcard_set_id, created_at } =
        await req.json();

    try {
        const audioPutCommand = new PutCommand({
            TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
            Item: {
                user_id: user_id,
                title: title,
                description: description,
                flashcard_set_id: flashcard_set_id,
                created_at: created_at,
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

        let res = await audioRes;
        res = await flashcardsRes;

        return NextResponse.json(
            {
                message: `uploaded successfully to db`,
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: `Failed to upload` },
            { status: 500 }
        );
    }
}
