"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SummaryPage({ params }) {
    const [audio, setAudio] = useState(null);
    const [audioSrc, setAudioSrc] = useState("");
    const [fileType, setFileType] = useState("");
    const router = useRouter();
    const created_at = params.created_at;

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
                return json.data;
            })
            .then((audio) => {
                setFileType(`audio/${audio?.s3_link?.split(".").pop()}`);
                const s3Key = audio?.s3_link?.split("amazonaws.com")[1];
                setAudioSrc(
                    `${process.env.NEXT_PUBLIC_AWS_CLOUD_FRONT_DOMAIN_NAME}${s3Key}`
                );
                return audio.summary;
            })
            .then((summary) => {
                console.log("checking for summary");
                if (!summary) {
                    // TODO: POST request to call LLM and insert summary and flashcards into DB
                    console.log("generating summary...");
                    fetch("/api/generateSummaryAndFlashcards", {
                        method: "POST",
                        body: JSON.stringify({
                            created_at: created_at,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            const summary = json.data;
                            console.log("summary generated: ", summary);
                            setAudio((prevAudio) => ({
                                ...prevAudio,
                                summary: summary,
                            }));
                        });
                } else {
                    console.log("summary exists");
                }
            });
    }, []);

    const handleHome = () => {
        router.push("/home");
    };

    const handleFlashcard = () => {
        router.push(
            `/summary/${audio?.created_at}/flashcards/${audio?.flashcard_set_id}`
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
            {audioSrc ? (
                <div className="h-full overflow-y-hidden mx-24">
                    <div className="flex justify-center mt-4">
                        <audio
                            controls
                            controlsList="nodownload"
                            className="w-full 2xl:max-w-5xl lg:max-w-3xl sm:max-w-xl"
                        >
                            <source src={audioSrc} type={fileType} />
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
                    <div className="text-center truncate">
                        {audio?.transcription}
                    </div>

                    <div className="container mx-auto p-4 h-5/6">
                        <div className="flex flex-col h-full lg:flex-row lg:space-x-4 space-y-12 lg:space-y-0">
                            <div className="flex-1 h-2/5 lg:h-full">
                                <h2 className="font-semibold pb-2 pl-4">
                                    Transcription
                                </h2>
                                <div className=" h-full overflow-y-auto border p-4 bg-neutral-50">
                                    {audio && audio.vtt ? (
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
                                    {audio && audio.summary ? (
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
                <div className="text-center">Loading...</div>
            )}
        </div>
    );
}
