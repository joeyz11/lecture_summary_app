"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loadingSpinner";

export default function SummaryPage({ params }) {
    const [audio, setAudio] = useState(null);
    const router = useRouter();
    const created_at = params.created_at;
    const POLL_INTERVAL = 5000;

    useEffect(() => {
        let timeoutId;
        const fetchAudio = () => {
            fetch(`/api/getAudioData?&created_at=${created_at}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then(async (json) => {
                    setAudio(json.data);
                    if (
                        !(
                            json.data.s3_link &&
                            json.data.vtt &&
                            json.data.summary
                        )
                    ) {
                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(fetchAudio, POLL_INTERVAL);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching data:", err);
                    clearTimeout(timeoutId);
                });
        };

        fetchAudio();

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const handleHome = () => {
        localStorage.removeItem("generating");
        router.push("/home");
    };

    const handleFlashcard = () => {
        localStorage.removeItem("generating");
        router.push(
            `/summary/${created_at}/flashcards/${audio?.flashcard_set_id}`
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
                <div className="text-center text-xl font-bold truncate">
                    {audio?.title}
                </div>
                <button
                    onClick={handleFlashcard}
                    className="w-32 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded"
                >
                    Flashcards!
                </button>
            </div>
            {audio ? (
                <div className="h-full overflow-y-hidden mx-24">
                    <div className="flex justify-center mt-4">
                        <audio
                            controls
                            controlsList="nodownload"
                            className="w-full 2xl:max-w-5xl lg:max-w-3xl sm:max-w-xl"
                        >
                            {audio.s3_link && (
                                <source
                                    src={`${
                                        process.env
                                            .NEXT_PUBLIC_AWS_CLOUD_FRONT_DOMAIN_NAME
                                    }${
                                        audio.s3_link.split("amazonaws.com")[1]
                                    }`}
                                    type={`audio/${audio.s3_link
                                        .split(".")
                                        .pop()}`}
                                />
                            )}
                            {/* <track
                            kind="captions"
                            src="test.vtt"
                            srclang="en"
                            label="English"
                            default
                        /> */}
                            Your browser does not support the audio element.
                        </audio>
                    </div>

                    <div className="text-center text-sm truncate">
                        {audio?.description}
                    </div>

                    <div className="container mx-auto p-4 h-4/5">
                        <div className="flex flex-col h-full lg:flex-row lg:space-x-4 space-y-12 lg:space-y-0">
                            <div className="flex-1 h-2/5 lg:h-full">
                                <h2 className="font-semibold pb-2 pl-4">
                                    Transcription
                                </h2>
                                <div className=" h-full overflow-y-auto border p-4 bg-neutral-50">
                                    {audio.vtt ? (
                                        <div className="whitespace-pre-line text-sm">
                                            {audio.vtt}
                                        </div>
                                    ) : (
                                        <div>No transcript yet</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 h-2/5 lg:h-full">
                                <h2 className="font-semibold pb-2 pl-4">
                                    Summary
                                </h2>
                                <div className=" h-full overflow-y-auto border p-4 bg-neutral-50">
                                    {audio.summary ? (
                                        <div className="whitespace-pre-line text-sm">
                                            {audio.summary}
                                        </div>
                                    ) : (
                                        <div>No summary yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
}
