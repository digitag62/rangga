"use server";

import prismadb from "@/lib/prisma";
import { hashPassword } from "@/lib/helpers";
import { RegisterProps } from "@/lib/types";

export const createUser = async (payload: RegisterProps) => {
  const hashedPassword = await hashPassword(payload.password);

  try {
    await prismadb.user.create({
      data: {
        email: payload.email,
        pwd: hashedPassword,
        createdBy: payload.email,
      },
    });

    return { success: true, message: "Register User: Success" };
  } catch (error) {
    return { success: false, message: "Register User: Failed" };
  }
};
