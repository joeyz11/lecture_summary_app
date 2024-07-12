import { useState, useEffect } from "react";

export default function FlipCard({ frontText, backText, currentIndex }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            resetFlip();
        }, 500);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    const resetFlip = () => {
        setIsFlipped(false);
    };

    return (
        <div className="flex items-center justify-center w-full h-auto">
            <div className="group h-96 w-5/6 cursor-pointer [perspective:1000px]">
                <div
                    className={`relative bg-neutral-50 border h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                    onClick={toggleFlip}
                >
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                        <div className="p-4 flex min-h-full flex-col items-center justify-center">
                            {frontText}
                        </div>
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden] h-full w-full rounded-xl [transform-style:preserve-3d] [transform:rotateY(180deg)]">
                        <div className="p-4 flex min-h-full flex-col items-center justify-center">
                            {backText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
