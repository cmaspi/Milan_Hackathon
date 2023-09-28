import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
          if (!profile.email.endsWith("@iith.ac.in")) {
            console.log("Not an IITH email");
            return false;
          }
          return profile.email_verified;
        },
        async jwt({ token, user, account }) {
          // Persist the OAuth access_token to the token right after signin
          if (account) {
            token.id_token = account.id_token;
          }
          return token;
        },
        async session({ session, token }) {
          // Send properties to the client, like an access_token from a provider.
          session.id_token = token.id_token;
          return session;
        },
      },
    secret : process.env.JWT_SECRET,
});
