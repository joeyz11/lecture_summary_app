import { SignOutButton } from "../../components/authButtons";
import UploadBox from "../../components/uploadBox";
import { test_audio } from "./test";
import Card from "@/components/card";
import { getSession } from "../../../utils/auth";

export default async function HomePage() {
    const session = await getSession();

    console.log(session);
    // {session.user.email} {session.user.name}
    return (
        <div className="flex h-screen bg-neutral-100">
            <div className="w-36 flex flex-col items-center justify-start gap-y-4 pt-8">
                <img src={session?.user?.image} className="rounded-full" />
                <SignOutButton />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex h-fit justify-center">
                    <UploadBox />
                </div>
                <div className="flex container mx-auto p-4 justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {test_audio.map((audio) => (
                            <Card audio={audio} key={audio.audio_id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
