"use client";
import { SessionProvider } from "next-auth/react";

export default function HomeLayout({ children }) {
    return (
        <section>
            <SessionProvider>{children}</SessionProvider>
        </section>
    );
}
