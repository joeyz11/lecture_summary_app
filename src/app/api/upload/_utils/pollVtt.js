import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { awsConfig } from "../../../../../utils/auth";
import {
    VTT_POLL_INTERVAL,
    VTT_POLL_TIMEOUT,
} from "../../../../../utils/const";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export default async function pollVtt(user_id, created_at) {
    const startTime = Date.now();
    let audioRes;
    let vtt;

    while (Date.now() - startTime < VTT_POLL_TIMEOUT) {
        try {
            const audioGetCommand = new GetCommand({
                TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
                Key: {
                    user_id: user_id,
                    created_at: created_at,
                },
                ProjectionExpression: "vtt",
            });
            audioRes = await docClient.send(audioGetCommand);
            vtt = audioRes.Item.vtt;
            if (vtt) {
                console.log("successfully got vtt");
                return { message: `successfully got vtt` };
            }

            await new Promise((resolve) =>
                setTimeout(resolve, VTT_POLL_INTERVAL)
            );
        } catch (err) {
            console.log("Error polling vtt", err);
            return { error: `Error polling vtt ${err}` };
        }
    }

    console.log(`Error polling vtt exceeded ${TIMEOUT} milliseconds`, err);
    return { error: `Error polling vtt exceeded ${TIMEOUT} milliseconds` };
}
