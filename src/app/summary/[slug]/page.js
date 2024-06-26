"use client";

import { test_audio } from "../../home/test";
import { usePathname } from "next/navigation";

export default function SummaryPage() {
    const pathname = usePathname();
    const audio_id = pathname.split("/")[2];
    const audio = test_audio.filter(
        (obj) => obj.audio_id.toString() === audio_id
    )[0];
    console.log("audio", audio);

    return (
        <div className="flex flex-col">
            <div>summary at {pathname}</div>
            <div>{audio.user_id}</div>
            <div>{audio.audio_id}</div>
            <div>{audio.title}</div>
            <div>{audio.desciption}</div>
            <div>{audio.audio_link}</div>
            <div>{audio.transcription}</div>
            <div>{audio.summary}</div>
            <div>{audio.flashcard_set_id}</div>
        </div>
    );
}
