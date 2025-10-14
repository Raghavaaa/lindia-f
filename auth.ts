import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { saveUser, getUser } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Save or update user in database
          await saveUser({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            image: user.image,
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
    async session({ session, token }) {
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
  },
  pages: {
    signIn: "/login",
  },
});
