"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { LedgerPayload } from "@/lib/types";

export const getAllLedgers = async () => {
  try {
    const data = await prismadb.ledger.findMany();
    return { success: true, message: "Fetch success", data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Fetch failed", data: null };
  }
};

export const createLedger = async (payload: LedgerPayload) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.ledger.create({
      data: {
        amount: payload.amount,
        remarks: payload.remarks,
        catId: payload.catId,
        bookId: payload.bookId,
        userId: payload.userId,
        isActive: payload.isActive,
        createdBy: sessionCheck.data?.email!,
      },
    });

    revalidatePath("/ledger");
    return { success: true, message: "Create Ledger: Success" };
  } catch (error) {
    return handlePrismaError(error, "Ledger");
  }
};

export const updateLedger = async (payload: LedgerPayload, id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.ledger.update({
      data: {
        amount: payload.amount,
        remarks: payload.remarks,
        catId: payload.catId,
        bookId: payload.bookId,
        userId: payload.userId,
        isActive: payload.isActive,
        updatedBy: sessionCheck.data?.email!,
      },
      where: { id },
    });

    revalidatePath("/ledger");
    return { success: true, message: "Update Ledger: Success" };
  } catch (error) {
    return handlePrismaError(error, "Ledger");
  }
};

export const deleteLedger = async (id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.ledger.delete({ where: { id } });
    revalidatePath("/ledger");
    return { success: true, message: "Delete Ledger: Success" };
  } catch (error) {
    return handlePrismaError(error, "Ledger");
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
