import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from 'next-auth/providers/github';
import prisma from "@lib/prisma";
import { compare } from "bcrypt";
import { AuthOptions } from "next-auth";
import { userAgentFromString } from "next/server";

export const authOptions: AuthOptions = ({
  providers: [
    GitHub({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password }: { email: string; password: string } = credentials as { email: string; password: string };
        if (!email || !password) {
          throw new Error("Missing username or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        // if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid username or password");
        } 
        console.log(user + "at auth config")
        return {...user, id: user.id.toString()};
      },
    }),
  ],
  secret: "2Tia0rI+DjBVLod9z1dr6h0C4ha4TrxJbt2Zj1g4NEo=",
  pages: {
    signIn: '/login',  // カスタムのサインインページ
  },
  // 新しいSessionが追加できない
  // sessionが空になっている
  callbacks: {
    async session({ session }) {
        // 自動でsessionのuserがcallbacksに入るらしい（？）が、入らないので指定する
        const sessionUser = session.user
        if (sessionUser?.email) {
            // console.log("we've got" + " "+ sessionUser?.email)
            const userFromPrismaTable = await prisma.user.findUnique({
            // prismaのUserテーブルからsessionUser?.emailの値で検索
            where: { 
              email: sessionUser?.email,
            },
            select: {
              username: true,
            }
          });
      
        if (userFromPrismaTable) {
            session.neouser = userFromPrismaTable;
            console.log("session")
          }
        } else {
            console.log("we haven't got user's email")
        }
        return session;
      }
    // 他のコールバック... jwt, signinなど
  }
});