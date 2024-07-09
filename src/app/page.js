import { GoogleSignInButton } from "../components/authButtons";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "../../utils/auth";

export default async function SignInPage() {
    const session = await getServerSession(authConfig);
    if (session) {
        redirect("/home");
    }

    return (
        <div className="flex items-center justify-center h-screen bg-neutral-100">
            <p>We are in {process.env.NEXT_PUBLIC_ENV}</p>
            <GoogleSignInButton />
        </div>
    );
}
