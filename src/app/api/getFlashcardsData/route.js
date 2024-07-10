import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getSessionUserId, awsConfig } from "../../../../utils/auth";

import { NextResponse } from "next/server";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const created_at = searchParams.get("created_at");
    const flashcard_set_id = searchParams.get("flashcard_set_id");
    const user_id = await getSessionUserId();

    try {
        const flashcardsGetCommand = new GetCommand({
            TableName: process.env.AWS_DYNAMO_DB_FLASHCARDS_TABLE_NAME,
            Key: {
                flashcard_set_id: flashcard_set_id,
                created_at: created_at,
            },
        });
        const flashcardsRes = await docClient.send(flashcardsGetCommand);
        console.log("audiogetcommand res", flashcardsRes);

        console.log("audio item", flashcardsRes.Item);

        return NextResponse.json(
            {
                message: `query successfully to db`,
                data: flashcardsRes.Item,
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: `Failed to query ${err}` },
            { status: 500 }
        );
    }
}
