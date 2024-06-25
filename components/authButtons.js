"use client";

import { signIn, signOut } from "next-auth/react";

export function GoogleSignInButton() {
    return (
        <button
            onClick={() =>
                signIn("google", { callbackUrl: "http://localhost:3000/home" })
            }
        >
            Sign in with Google
        </button>
    );
}

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
        >
            Sign out
        </button>
    );
}
