import { NextResponse } from "next/server";
import uploadDB from "./_utils/uploadDB";
import uploadS3 from "./_utils/uploadS3";
import pollVtt from "./_utils/pollVtt";
import generateSummaryAndFlashcards from "./_utils/generateSummaryAndFlashcards";
import removeShadowFlag from "./_utils/removeShadowFlag";

export async function POST(req) {
    const formData = await req.formData();
    const user_id = formData.get("user_id");
    const created_at = formData.get("created_at");
    const title = formData.get("title");
    const description = formData.get("description");
    const flashcard_set_id = formData.get("flashcard_set_id");
    const is_shadow = formData.get("is_shadow");
    const file = formData.get("file");

    try {
        // Call 1
        const uploadDBRes = await uploadDB(
            user_id,
            created_at,
            title,
            description,
            flashcard_set_id,
            is_shadow
        );
        if (uploadDBRes.error) console.log(uploadDBRes.error);
        else console.log(uploadDBRes.message);

        // Call 2
        const uploadS3Res = await uploadS3(user_id, created_at, file);
        if (uploadS3Res.error) console.log(uploadS3Res.error);
        else console.log(uploadS3Res.message);

        // Call 3
        const pollVttRes = await pollVtt(user_id, created_at);
        if (pollVttRes.error) console.log(pollVttRes.error);
        else console.log(pollVttRes.message);

        // Call 4
        const generateSummaryAndFlashcardsRes =
            await generateSummaryAndFlashcards(
                user_id,
                created_at,
                flashcard_set_id
            );
        if (generateSummaryAndFlashcardsRes.error)
            console.log(generateSummaryAndFlashcardsRes.error);
        else console.log(generateSummaryAndFlashcardsRes.message);

        // Call 5
        const removeShadowFlagRes = await removeShadowFlag(user_id, created_at);
        if (removeShadowFlagRes.error) console.log(removeShadowFlagRes.error);
        else console.log(removeShadowFlagRes.message);

        console.log("successful upload");
        return NextResponse.json(
            {
                message: "successful upload",
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: `failed upload: ${err}` },
            { status: 500 }
        );
    }
}
