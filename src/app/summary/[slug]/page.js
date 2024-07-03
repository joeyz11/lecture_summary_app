"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SummaryPage() {
    const [audio, setAudio] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const created_at = pathname.split("/")[2];

    useEffect(() => {
        fetch(`/api/getAudioData?&created_at=${created_at}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((json) => {
                setAudio(json.data);
            });
    }, [created_at]);

    const handleHome = () => {
        router.push("/home");
    };

    const handleFlashcard = () => {
        router.push(
            `/summary/${audio.created_at}/flashcards/${audio.flashcard_set_id}`
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
                <div className="text-center">{audio?.title}</div>
                <button
                    onClick={handleFlashcard}
                    className="w-32 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                >
                    Flashcards!
                </button>
            </div>
            <div className="text-center">play audio here</div>
            <div className="text-center">{audio?.description}</div>
            <div className="text-center">{audio?.created_at}</div>
            <div className="text-center">{audio?.flashcard_set_id}</div>
            <div className="text-center">{audio?.s3_link}</div>
            <div className="text-center">{audio?.user_id}</div>
            <div>{audio?.transcription}</div>
            <div>{audio?.summary}</div>
        </div>
    );
}
