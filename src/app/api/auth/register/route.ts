import NextAuth, { NextAuthOptions } from "next-auth"; // Import NextAuthOptions
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  // Add explicit type here
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Correct destructuring and type handling
    async signIn({ profile }) {
      if (!profile?.email) return false;
      return profile.email.endsWith("@gmail.com");
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
