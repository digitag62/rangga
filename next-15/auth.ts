import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod";
import bcrypt from "bcrypt";

import { authConfig } from "@/auth.config";
import { User } from "@/lib/types";
import prismadb from "@/lib/prisma";

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // You can use the 'authorize' function to handle the authentication logic.
      async authorize(credentials) {
        // Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // After validating the format of credentials using zod
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // create a 'getUser' function that queries the user from the database
          const user = await getUser(email);
          if (!user) return null;

          // call bcrypt.compare to check if the passwords match:
          const passwordsMatch = await bcrypt.compare(password, user.pwd);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    })
  ],
})