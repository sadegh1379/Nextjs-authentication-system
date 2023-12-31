import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"

import { compare } from "bcrypt";
import db from "./db";
// import { UserRole } from "@prisma/client";
export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jb@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Check if user credentials are Correct
          if (!credentials?.email || !credentials?.password) {
            throw { error: "No Inputs Found", status: 401 };
          }
          //Check if user exists
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          });
          if (!existingUser) {
            throw { error: "No user found", status: 401 };
          }

          //Check if Password is correct
          const passwordMatch = await compare(
            credentials.password,
            existingUser.hashedPassword
          );
          if (!passwordMatch) {
            throw { error: "Password Incorrect", status: 401 };
          }
          const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            image: existingUser.image,
            emailVerified: existingUser.emailVerified
          };
          //
          return user;
        } catch (error) {
          console.log(error);
          throw { error: "Something went wrong", status: 401 };
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (token) {
        console.log(`token:${token} in session`);
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            console.log(`token:${token} in session`);
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.role = user.role;
            token.image = user.picture;
            token.emailVerified = user.emailVerified;
        }
        return token
    },
  },
};