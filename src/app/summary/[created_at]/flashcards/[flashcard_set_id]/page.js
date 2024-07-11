"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Slider from "@/components/slider";
import LoadingSpinner from "@/components/loadingSpinner";

export default function FlashcardPage({ params }) {
    const created_at = params.created_at;
    const flashcard_set_id = params.flashcard_set_id;
    const [flashcards, setFlashcards] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetch(
            `/api/getFlashcardsData?&created_at=${created_at}&flashcard_set_id=${flashcard_set_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((json) => {
                setFlashcards(json.data);
            });
    }, []);

    const handleHome = () => {
        router.push("/home");
    };

    const handleSummary = () => {
        router.push(`/summary/${created_at}`);
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
                <div className="text-center text-xl font-bold truncate">
                    {flashcards?.title}
                </div>
                <button
                    onClick={handleSummary}
                    className="w-32 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                >
                    Summary
                </button>
            </div>
            {flashcards ? (
                <div className="flex justify-center items-center">
                    <Slider flashcards={flashcards?.question_answer_set} />
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
}
