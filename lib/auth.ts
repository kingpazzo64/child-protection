import { AuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (
          !user ||
          !user.password ||
          !(await compare(credentials.password, user.password)) ||
          !user.emailVerified ||
          user.disabled
        ) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Optional: show errors on the login page
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getUserFromRequest(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  return session.user
}

export function signToken(user: { id: number; role: string }) {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET")
  }

  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: "7d" }
  )
}


