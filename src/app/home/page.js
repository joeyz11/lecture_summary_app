import { getServerSession } from "next-auth";
import { authConfig } from "../../../utils/auth";
import { SignOutButton } from "../../components/authButtons";
import { redirect } from "next/navigation";
import UploadBox from "../../components/uploadBox";
import { test_audio, test_flashcard } from "./test";

export default async function HomePage() {
    const session = await getServerSession(authConfig);
    if (!session) {
        redirect("/");
    }
    console.log(session);
    // {session.user.email} {session.user.name}
    return (
        <div className="flex h-screen bg-neutral-100">
            <div className="w-36 flex flex-col items-center justify-start gap-y-4 pt-8">
                <img src={session.user.image} className="rounded-full" />
                <SignOutButton />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex h-fit justify-center">
                    <UploadBox />
                </div>
                <div className="flex container mx-auto p-4 justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {test_audio.map((audio) => (
                            <div
                                key={audio.audio_id}
                                className="flex flex-col gap-2 hover:scale-110 hover:shadow-xl transition-all duration-500 bg-neutral-50 p-4 rounded shadow-md w-60 h-80 whitespace-normal truncate"
                            >
                                <div className="text-xl font-bold">
                                    {audio.title}
                                </div>
                                <div className="flex-grow">
                                    {audio.description}
                                </div>
                                <button className="bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded">
                                    Summary
                                </button>
                                <button className="bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded">
                                    Flashcard
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
