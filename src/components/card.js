"use client";

import { useRouter } from "next/navigation";

export default function Card({ audio }) {
    const router = useRouter();

    const handleSummary = (audio_id) => {
        router.push(`/summary/${audio_id}`);
    };

    const handleFlashcard = (audio_id, flashcard_set_id) => {
        router.push(`/summary/${audio_id}/flashcards/${flashcard_set_id}`);
    };

    return (
        <div
            key={audio.audio_id}
            className="flex flex-col gap-2 hover:scale-110 hover:shadow-xl transition-all duration-500 bg-neutral-50 p-4 rounded shadow-md w-60 h-80 whitespace-normal truncate"
        >
            <div className="text-xl font-bold">{audio.title}</div>
            <div className="flex-grow">{audio.description}</div>
            <button
                className="bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                onClick={() => handleSummary(audio.audio_id)}
            >
                Summary
            </button>
            <button
                className="bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                onClick={() =>
                    handleFlashcard(audio.audio_id, audio.flashcard_set_id)
                }
            >
                Flashcard
            </button>
        </div>
    );
}
