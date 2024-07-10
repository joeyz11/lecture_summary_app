import { getSessionUserId, awsConfig } from "../../../../utils/auth";
import { convertTimestampTextToTranscription } from "../../../../utils/utils";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { NextResponse } from "next/server";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(req) {
    const { created_at } = await req.json();
    const user_id = await getSessionUserId();

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
        const audioRes = await docClient.send(audioGetCommand);
        const vtt = audioRes.Item.vtt;
        console.log("vtt got", vtt);

        // 2. tranform to transcription using convertTimestampTextToTranscription
        const transcript = convertTimestampTextToTranscription(vtt);
        console.log("transcript", transcript);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 3. call openai to generate summary and flashcards
        const test_summary = "test_summary";
        const test_flashcards = [
            ["q1", "a1"],
            ["q2", "a2"],
            ["q3", "a3"],
        ];
        // 4. insert summary and flashcards into db

        return NextResponse.json(
            {
                message: `uploaded successfully to db`,
                data: test_summary,
            },
            { status: 200 }
        );
    } catch (err) {}
}
