import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getSessionUserId, awsConfig } from "../../../../utils/auth";

import { NextResponse } from "next/server";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
    const user_id = await getSessionUserId();

    try {
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
        return NextResponse.json(
            {
                message: `query successfully to db`,
                data: audioRes.Items,
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
