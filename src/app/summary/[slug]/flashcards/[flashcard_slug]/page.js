"use client";

import { test_flashcard } from "@/app/home/test";
import { usePathname } from "next/navigation";

export default async function FlashcardPage() {
    const pathname = usePathname();
    const flashcard_set_id = pathname.split("/")[4];
    const flashcard = test_flashcard.filter(
        (obj) => obj.flashcard_set_id.toString() === flashcard_set_id
    )[0];

    return (
        <div className="flex flex-col">
            <p>hi</p>
            <div>Flashcard at {pathname}</div>
            <div>{flashcard.flashcard_set_id}</div>
            <div>{flashcard.question_set}</div>
            <div>{flashcard.answer_set}</div>
        </div>
    );
}
