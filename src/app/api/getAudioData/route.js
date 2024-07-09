import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getSession, awsConfig } from "../../../../utils/auth";

import { NextResponse } from "next/server";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req) {
    const session = getSession();
    const { searchParams } = new URL(req.url);
    const created_at = searchParams.get("created_at");
    const user_id = (await session).user.email.split("@")[0];
    console.log("user_id", user_id);
    console.log("created_at", created_at);

    try {
        const audioGetCommand = new GetCommand({
            TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
            Key: {
                user_id: user_id,
                created_at: created_at,
            },
        });
        const audioRes = await docClient.send(audioGetCommand);
        console.log("audiogetcommand res", audioRes);

        console.log("audio item", audioRes.Item);

        return NextResponse.json(
            {
                message: `query successfully to db`,
                data: audioRes.Item,
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
