"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { CatPayload } from "@/lib/types";

export const getAllCats = async () => {
  try {
    const data = await prismadb.cat.findMany();
    return { success: true, message: "Fetch success", data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Fetch failed", data: null };
  }
};

export const createCat = async (payload: CatPayload) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.cat.create({
      data: {
        cat: payload.cat,
        max: payload.max,
        bookId: payload.bookId,
        userId: payload.userId,
        isActive: payload.isActive,
        createdBy: sessionCheck.data?.email!,
      },
    });

    revalidatePath("/cat");
    return { success: true, message: "Create Cat: Success" };
  } catch (error) {
    return handlePrismaError(error, "Cat");
  }
};

export const updateCat = async (payload: CatPayload, id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.cat.update({
      data: {
        cat: payload.cat,
        max: payload.max,
        bookId: payload.bookId,
        userId: payload.userId,
        isActive: payload.isActive,
        updatedBy: sessionCheck.data?.email!,
      },
      where: { id },
    });

    revalidatePath("/cat");
    return { success: true, message: "Update Cat: Success" };
  } catch (error) {
    return handlePrismaError(error, "Cat");
  }
};

export const deleteCat = async (id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.cat.delete({ where: { id } });
    revalidatePath("/cat");
    return { success: true, message: "Delete Cat: Success" };
  } catch (error) {
    return handlePrismaError(error, "Cat");
  }
};

// Error handler
const handlePrismaError = (error: any, label: string) => {
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
    switch (error.code) {
      case "P2002":
        return { success: false, message: `${label} already exists. It must be unique.` };
      case "P2003":
        return { success: false, message: `Cannot delete ${label}: Foreign key constraint failed.` };
      case "P2016":
        return { success: false, message: "Reference not found" };
      case "P2025":
        return { success: false, message: "Record not found" };
      default:
        return { success: false, message: `Known request error: ${error.message}` };
    }
  }

  return { success: false, message: "An unexpected error occurred." };
};
