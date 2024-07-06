"use client";

import { SignOutButton } from "../../components/authButtons";
import UploadBox from "../../components/uploadBox";
import Card from "@/components/card";
import shadowCard from "@/components/shadowCard";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

export default function HomePage() {
    const [homeCards, setHomeCards] = useState([]);

    useEffect(() => {
        fetch("/api/getHomeCardsData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((json) => {
                setHomeCards(json.data);
            });
    }, []);

    const { data } = useSession();
    const user_id = data?.user.email;

    const addHomeCard = (card) => {
        setHomeCards([card, ...homeCards]);
    };

    return (
        <div className="flex h-screen bg-neutral-100">
            <div className="w-36 flex flex-col items-center justify-start gap-y-4 pt-8">
                <img src={data?.user.image} className="rounded-full" />
                <SignOutButton />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex h-fit justify-center">
                    <UploadBox userId={user_id} addHomeCard={addHomeCard} />
                </div>
                <div className="flex container mx-auto p-4 justify-center">
                    {homeCards.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {homeCards.map((audio) => (
                                <div key={audio.created_at}>
                                    {audio.isShadow ? (
                                        // <shadowCard audio={audio} />
                                        <div className="cursor-progress animate-pulse bg-gray-200 text-gray-400 flex flex-col gap-2 p-4 rounded shadow-md w-60 h-80">
                                            <div className="text-xl font-bold">
                                                {audio.title}
                                            </div>
                                            <div className="">
                                                {audio.description}
                                            </div>
                                        </div>
                                    ) : (
                                        <Card audio={audio} />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No audio yet...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
