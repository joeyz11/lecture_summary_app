import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    GetCommand,
    UpdateCommand,
    DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import OpenAI from "openai";

import { awsConfig } from "../../../../../utils/auth";
import { convertTimestampTextToTranscription } from "../../../../../utils/utils";

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

const openAIClient = new OpenAI();

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
        const system_prompt = `Your task is to summarize a lecture for students and create a set of flashcards for studying the lecture.
As a professional summarizer, create a concise and comprehensive summary of the provided text, while adhering to these guidelines:
Craft a summary that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.
Incorporate main ideas and essential information, eliminating extraneous language and focusing on critical aspects.
Rely strictly on the provided text, without including external information.
Format the summary in paragraph form for easy understanding.
Create flashcards to help students review key concepts and details from the lecture.
Please provide the output in the following JSON format:
{
    "summary": "Summary of the lecture.",
    "flashcards": [
        ["Question 1", "Answer 1"],
        ["Question 2", "Answer 2"],
        ["Question 3", "Answer 3"],
        ...
    ]
}`;

        // 3. call openai to generate summary and flashcards
        const completion = await openAIClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: transcript },
            ],
            response_format: { type: "json_object" },
        });

        const openAIJson = JSON.parse(completion.choices[0].message.content);
        const summary = openAIJson.summary;
        const flashcards = openAIJson.flashcards;

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
