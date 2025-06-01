"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { BookPayload } from "@/lib/types";

export const getAllBooks = async () => {
  try {
    const data = await prismadb.book.findMany();
    return { success: true, message: "Fetch success", data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Fetch failed", data: null };
  }
};

export const createBook = async (payload: BookPayload) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.book.create({
      data: {
        name: payload.name,
        summary: payload.summary,
        userId: payload.userId,
        isActive: payload.isActive,
        createdBy: sessionCheck.data?.email!,
      },
    });

    revalidatePath("/book");
    return { success: true, message: "Create Book: Success" };
  } catch (error) {
    return handlePrismaError(error, "Book");
  }
};

export const updateBook = async (payload: BookPayload, id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.book.update({
      data: {
        name: payload.name,
        summary: payload.summary,
        userId: payload.userId,
        isActive: payload.isActive,
        updatedBy: sessionCheck.data?.email!,
      },
      where: { id },
    });

    revalidatePath("/book");
    return { success: true, message: "Update Book: Success" };
  } catch (error) {
    return handlePrismaError(error, "Book");
  }
};

export const deleteBook = async (id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.book.delete({ where: { id } });
    revalidatePath("/book");
    return { success: true, message: "Delete Book: Success" };
  } catch (error) {
    return handlePrismaError(error, "Book");
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
