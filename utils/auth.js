import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

export const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
};

export async function getSessionUserId() {
    const session = await getServerSession(authConfig);
    const user_id = (await session).user.email.split("@")[0];
    return user_id;
}

export const awsConfig = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};
