import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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

          const emails = await res.json(); 
          if (Array.isArray(emails)) {
            const primaryEmail = emails.find(
              (e: any) => e.primary && e.verified
            );
            if (primaryEmail) {
              user.email = primaryEmail.email;
            }
          }
          if (!user.email) {
            console.error("No verified primary email found for GitHub user");
            return false; 
          }
          console.log("GitHub emails fetched successfully");
        } catch (err) {
          console.error("Error fetching GitHub emails", err);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
};
