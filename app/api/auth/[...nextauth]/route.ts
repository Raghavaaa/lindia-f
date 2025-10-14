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
      if (account?.provider === "google") {
        try {
          await saveUser({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            image: user.image || undefined,
            provider: "google",
          });
          console.log("User saved successfully:", user.email);
          return true;
        } catch (error) {
          console.error("Error saving user:", error);
          // Don't fail the sign-in if database save fails
          console.log("Continuing with sign-in despite database error");
          return true;
        }
      }
      return true;
    },
    async session({ session }) {
      console.log("Session callback triggered:", { email: session.user?.email });
      if (session.user?.email) {
        try {
          const dbUser = await getUser(session.user.email);
          console.log("Database user found:", dbUser ? "yes" : "no");
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.phone = dbUser.phone;
            session.user.address = dbUser.address;
          } else {
            // Set a default ID if no database user found
            session.user.id = session.user.email;
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          // Set a default ID if database is unavailable
          session.user.id = session.user.email;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
