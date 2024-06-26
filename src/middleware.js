import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/",
        error: "/error",
    },
});

export const config = { matcher: ["/home", "/summary/:path*"] };
