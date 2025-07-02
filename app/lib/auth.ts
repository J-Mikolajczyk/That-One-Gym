import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import { getUserByEmail, linkAccount } from "@/app/lib/db/user";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
}

export const authOptions: AuthOptions = {
  adapter: NeonAdapter(pool),

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === "github" && profile && !profile.email) {
        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${account.access_token}`,
              Accept: "application/vnd.github+json",
            },
          });

          const emails: GitHubEmail[] = await res.json(); 
          const primaryEmail = emails.find((e) => e.primary && e.verified);
          if (primaryEmail) {
            profile.email = primaryEmail.email;
          } 
          else {
            console.error("No verified primary email found for GitHub user");
            return false; 
          }
          console.log("GitHub emails fetched successfully");
        } catch (err) {
          console.error("Error fetching GitHub emails", err);
          return false;
        }
      }

      if(user?.email) {
        const existingUser = await getUserByEmail(user.email);
        if (existingUser && existingUser.id !== user.id) {
          if (account) {
            await linkAccount(existingUser.id, account);
          }
          user.id = existingUser.id;
          user.role = existingUser.role;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.role) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
};
