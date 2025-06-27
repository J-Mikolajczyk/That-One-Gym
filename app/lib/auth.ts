import { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/app/lib/supabase"

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,    
    updateAge: 5 * 60,     
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const response =
        await supabase
          .from("users")
          .upsert({
            auth_id: user.id,  
            email: user.email,
            name: user.name,
          }, { onConflict: "auth_id" });
          
        token.id = user.id;

        console.log(response);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}
