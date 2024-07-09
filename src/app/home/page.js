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
    const user_id = data?.user.email.split("@")[0];

    const addHomeCard = (card) => {
        setTimeout(() => {
            setHomeCards([card, ...homeCards]);
        }, 500);
    };

    return (
        <div className="flex h-screen bg-neutral-100">
            <div className="w-36 flex flex-col items-center justify-start gap-y-4 pt-8">
                <img
                    src={data?.user.image}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                />
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
                                    <Card audio={audio} />
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
