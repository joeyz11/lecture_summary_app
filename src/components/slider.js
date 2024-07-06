import { useState } from "react";
import FlipCard from "./flipcard";

export default function Slider({ flashcards }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="relative my-24 w-full max-w-4xl mx-auto">
            <div className="overflow-x-clip">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {flashcards?.map((flashcard, index) => (
                        <div key={index} className="min-w-full relative">
                            <FlipCard
                                frontText={flashcard[0]}
                                backText={flashcard[1]}
                                currentIndex={currentIndex}
                            />
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-black">
                                <h2 className="text-lg">{`${index + 1}/${
                                    flashcards.length
                                }`}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-4 bg-gray-800 bg-opacity-20 hover:bg-opacity-30 hover:scale-125 duration-300 rounded-full text-white"
            >
                ‹
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-4 bg-gray-800 bg-opacity-20 hover:bg-opacity-30 hover:scale-125 duration-300 rounded-full text-white"
            >
                ›
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {flashcards?.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                            currentIndex === index
                                ? "bg-orange-500"
                                : "bg-neutral-200"
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
