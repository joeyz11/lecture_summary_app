"use client";

import { test_audio } from "../../home/test";
import { usePathname, useRouter } from "next/navigation";

export default function SummaryPage() {
    const router = useRouter();
    const pathname = usePathname();
    const audio_id = pathname.split("/")[2];
    const audio = test_audio.filter(
        (obj) => obj.audio_id.toString() === audio_id
    )[0];
    console.log("audio", audio);
    // <div>{audio.user_id}</div>
    // <div>{audio.audio_id}</div>
    // <div>{audio.audio_link}</div>
    // <div>{audio.flashcard_set_id}</div>
    const handleHome = () => {
        router.push("/home");
    };

    const handleFlashcard = () => {
        router.push(
            `/summary/${audio.audio_id}/flashcards/${audio.flashcard_set_id}`
        );
    };

    return (
        <div className="flex flex-col p-6 h-screen bg-neutral-100">
            <div className="flex flex-row justify-between">
                <button
                    onClick={handleHome}
                    className="w-32 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                >
                    Home
                </button>
                <div className="text-center">{audio.title}</div>
                <button
                    onClick={handleFlashcard}
                    className="w-32 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                >
                    Flashcards!
                </button>
            </div>
            <div className="text-center">play audio here</div>
            <div className="text-center">{audio.description}</div>
            <div>{audio.transcription}</div>
            <div>{audio.summary}</div>
        </div>
    );
}
