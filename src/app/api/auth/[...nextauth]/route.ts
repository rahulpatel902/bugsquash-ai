import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-expect-error - adding custom property
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
