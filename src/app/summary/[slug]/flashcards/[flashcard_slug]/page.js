"use client";

import { test_flashcard } from "@/app/home/test";
import { usePathname, useRouter } from "next/navigation";
import Slider from "@/components/slider";

export default function FlashcardPage() {
    const router = useRouter();
    const pathname = usePathname();
    const audio_id = pathname.split("/")[2];
    const flashcard_set_id = pathname.split("/")[4];
    const flashcards = test_flashcard.filter(
        (obj) => obj.flashcard_set_id.toString() === flashcard_set_id
    )[0];

    const zip = (arr1, arr2) => {
        const maxLength = Math.max(arr1.length, arr2.length);
        const zipped = [];
        for (let i = 0; i < maxLength; i++) {
            zipped.push([arr1[i], arr2[i]]);
        }
        return zipped;
    };

    const QandA = zip(flashcards.question_set, flashcards.answer_set);

    const handleHome = () => {
        router.push("/home");
    };

    const handleSummary = () => {
        router.push(`/summary/${audio_id}`);
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
                <div className="text-center">{flashcards.title}</div>
                <button
                    onClick={handleSummary}
                    className="w-32 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                >
                    Summary
                </button>
            </div>
            <div className="flex justify-center items-center">
                <Slider flashcards={QandA} />
            </div>
        </div>
    );
}
