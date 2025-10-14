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
      if (account?.provider === "google") {
        try {
          await saveUser({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            image: user.image || undefined,
            provider: "google",
          });
          return true;
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          const dbUser = await getUser(session.user.email);
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.phone = dbUser.phone;
            session.user.address = dbUser.address;
          }
        } catch (error) {
          console.error("Error fetching user:", error);
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
