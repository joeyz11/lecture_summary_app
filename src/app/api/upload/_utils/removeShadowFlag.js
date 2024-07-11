import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { awsConfig } from "../../../../../utils/auth";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export default async function removeShadowFlag(user_id, created_at) {
    try {
        const audioUpdateCommand = new UpdateCommand({
            TableName: process.env.AWS_DYNAMO_DB_AUDIO_TABLE_NAME,
            Key: {
                user_id: user_id,
                created_at: created_at,
            },
            UpdateExpression: "SET #is_shadow = :is_shadow",
            ExpressionAttributeNames: {
                "#is_shadow": "is_shadow",
            },
            ExpressionAttributeValues: {
                ":is_shadow": false,
            },
        });

        await docClient.send(audioUpdateCommand);

        console.log("shadow flag successfully removed in db");
        return { message: "shadow flag successfully removed in db" };
    } catch (err) {
        console.log("Failed to remove shadow flag");
        return { error: "Failed to remove shadow flag" };
    }
}
