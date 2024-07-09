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
            .then(async (json) => {
                await json.data;
                setAudio(json.data);
                return json.data;
            })
            .then((audio) => {
                setFileType(`audio/${audio?.s3_link?.split(".").pop()}`);
                const s3Key = audio?.s3_link?.split("amazonaws.com")[1];
                setAudioSrc(
                    `${process.env.NEXT_PUBLIC_AWS_CLOUD_FRONT_DOMAIN_NAME}${s3Key}`
                );
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
                                    <p>{audio?.transcription}</p>
                                </div>
                            </div>

                            <div className="flex-1 h-2/5 lg:h-full">
                                <h2 className="font-semibold pb-2 pl-4">
                                    Summary
                                </h2>
                                <div className=" h-full overflow-y-auto border p-4 bg-neutral-50">
                                    <p>{audio?.transcription}</p>
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

// """
// You've begun your new job to organize newspapers.
// Each morning, you are to separate the newspapers into smaller piles and assign each pile to a co-worker.
// This way, your co-workers can read through the newspapers and examine their contents simultaneously.

// Each newspaper is marked with a read time to finish all its contents.
// A worker can read one newspaper at a time, and, when they finish one, they can start reading the next.
// Your goal is to minimize the amount of time needed for your co-workers to finish all newspapers.
// Additionally, the newspapers came in a particular order, and you must not disarrange the original ordering when distributing the newspapers.

// What is the minimum amount of time it would take to have your coworkers go through all the newspapers?
// That is, what is the longest reading time among all piles?

// Constraints:
// 1 <= newspapers_read_times.length <= 10^5
// 1 <= newspapers_read_times[i] <= 10^5
// 1 <= num_coworkers <= 10^5

// Example 1:
// Input: newspapers_read_times = [7,2,5,10,8], num_coworkers = 2
// Output: 18
// Assign first 3 newspapers to one coworker then assign the rest to another. The time it takes for the first 3 newspapers is 7 + 2 + 5 = 14 and for the last 2 is 10 + 8 = 18.

// Example 2:
// Input: newspapers_read_times = [2,3,5,7], num_coworkers = 3
// Output: 7
// Assign [2, 3], [5], and [7] separately to workers. The minimum time is 7.

// Example 3:
// newspapers_read_times = [12, 15, 7, 8, 9, 10, 5, 20, 13, 6]
// num_coworkers = 4

// """
// def minimize_max_reading_time(newspapers_read_times, num_coworkers):
//     """
//     Determines the minimum maximum reading time when newspapers
//     are distributed optimally among coworkers while maintaining the order.

//     Parameters:
//     newspapers_read_times (list of int): The read times of each newspaper.
//     num_coworkers (int): The number of coworkers to distribute the newspapers to.

//     Returns:
//     int: The minimized maximum reading time for any single coworker.
//     """
//     lower_bound = max(newspapers_read_times)
//     upper_bound = sum(newspapers_read_times)

//     cand = (lower_bound + upper_bound)//2

// def test_read_time(newspapers_read_times, num_coworkers, test_time):
//     time_for_worker = [0]*num_coworkers
//     curr_worker = 0

//     for read_time in newspapers_read_times:

//         if time_for_worker[curr_worker] + read_time <= test_time:
//            time_for_worker[curr_worker] += read_time
//         else:
//             curr_worker += 1
//             if curr_worker >= num_coworkers:
//                 return False
//             time_for_worker[curr_worker] += read_time

//     return True

// # Test Case 1: Few coworkers, long reading times
// print(minimize_max_reading_time([30, 20, 40, 10, 50], 2))  # Expected Output: 100 or 110

// # Test Case 2: More coworkers than newspapers
// print(minimize_max_reading_time([5, 10, 15], 5))  # Expected Output: 15

// # Test Case 3: Newspapers with identical reading times
// print(minimize_max_reading_time([10, 10, 10, 10, 10, 10], 3))  # Expected Output: 20

// # Test Case 4: Large number of newspapers, small number of coworkers
// print(minimize_max_reading_time([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2))  # Expected Output: 78 or 79

// # Test Case 5: Alternating high and low reading times
// print(minimize_max_reading_time([20, 1, 20, 1, 20, 1, 20], 4))  # Expected Output: 21

// # Test Case 6: All newspapers have the same reading time
// print(minimize_max_reading_time([4, 4, 4, 4, 4, 4, 4, 4], 4))  # Expected Output: 8

// # Test Case 7: More realistic and balanced distribution
// print(minimize_max_reading_time([5, 5, 5, 5, 20, 20, 20, 20, 10, 10, 10, 10], 4))  # Expected Output: 30 or 35
