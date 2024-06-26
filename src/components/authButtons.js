"use client";

import { signIn, signOut } from "next-auth/react";

export function GoogleSignInButton() {
    return (
        <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
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
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
        >
            Sign out
        </button>
    );
}
