import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { saveUser, getUser } from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback triggered:", { user: user.email, provider: account?.provider });
      // Always allow sign in - don't block on database issues
      return true;
    },
    async session({ session }) {
      console.log("Session callback triggered:", { email: session.user?.email });
      if (session.user?.email) {
        // Set a simple ID for the session
        session.user.id = session.user.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      // Always redirect to dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
