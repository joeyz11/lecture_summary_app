"use client";

import { SignOutButton } from "../../components/authButtons";
import UploadBox from "../../components/uploadBox";
import Card from "@/components/card";
import Image from "next/image";
import ShadowCard from "@/components/shadowCard";
import LoadingSpinner from "@/components/loadingSpinner";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

export default function HomePage() {
    const [homeCards, setHomeCards] = useState(null);

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

    const addShadowCard = (shadowCard) => {
        setHomeCards((prevHomeCards) => [shadowCard, ...prevHomeCards]);
    };

    const replaceWithHomeCard = (created_at) => {
        setHomeCards((prevHomeCards) => {
            const indexToReplace = prevHomeCards.findIndex(
                (card) => card.created_at === created_at
            );

            if (indexToReplace !== -1) {
                const updatedCards = [...prevHomeCards];
                updatedCards[indexToReplace] = {
                    ...updatedCards[indexToReplace],
                    is_shadow: false,
                };
                return updatedCards;
            } else {
                return prevHomeCards;
            }
        });
    };

    return (
        <div className="flex h-screen bg-neutral-100">
            <div className="w-36 flex flex-col items-center justify-start gap-y-4 pt-8">
                {data ? (
                    <Image
                        src={data.user.image}
                        alt="User Profile Image"
                        width={100}
                        height={100}
                        quality={100}
                        priority
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-[100px] h-[100px]"></div>
                )}
                <SignOutButton />
            </div>
            <div className="flex-1 overflow-y-scroll p-4">
                <div className="flex h-fit justify-center">
                    <UploadBox
                        userId={user_id}
                        addShadowCard={addShadowCard}
                        replaceWithHomeCard={replaceWithHomeCard}
                    />
                </div>
                <div className="flex container mx-auto p-4 justify-center">
                    {homeCards ? (
                        homeCards.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                                {homeCards.map((audio) => (
                                    <div key={audio.created_at}>
                                        {audio.is_shadow ? (
                                            <ShadowCard audio={audio} />
                                        ) : (
                                            <Card audio={audio} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No audio yet...</div>
                        )
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>
            </div>
        </div>
    );
}
