import { GoogleSignInButton } from "../../components/authButtons";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "../../utils/auth";

export default async function SignInPage() {
    const session = await getServerSession(authConfig);
    if (session) {
        redirect("/home");
    }

    return (
        <div>
            <GoogleSignInButton />
        </div>
    );
}
