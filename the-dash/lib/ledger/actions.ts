"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { LedgerPayload } from "@/lib/ledger/types";
import { handlePrismaError } from "../helper";

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
				type: payload.type,
				amount: payload.amount,
				remarks: payload.remarks,
				catId: payload.catId,
				bookId: payload.bookId,
				userId: sessionCheck.data?.id!,
				isActive: payload.isActive === "true",
				createdBy: sessionCheck.data?.email!,
			},
		});

		revalidatePath("/ledger");
		return { success: true, message: "Create Ledger: Success" };
	} catch (error) {
		return handlePrismaError(error, "Ledger");
	}
};

export const updateLedger = async (payload: LedgerPayload, ledgerId: string, userId: string) => {
	const sessionCheck = await checkSession("author-only", userId);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.ledger.update({
			data: {
				type: payload.type,
				amount: payload.amount,
				remarks: payload.remarks,
				catId: payload.catId,
				bookId: payload.bookId,
				userId: sessionCheck.data?.id!,
				isActive: payload.isActive === "true",
				updatedBy: sessionCheck.data?.email!,
			},
			where: { id: ledgerId },
		});

		revalidatePath("/ledger");
		return { success: true, message: "Update Ledger: Success" };
	} catch (error) {
		return handlePrismaError(error, "Ledger");
	}
};

export const deleteLedger = async (ledgerId: string, userId: string) => {
	const sessionCheck = await checkSession("author-only", userId);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.ledger.delete({ where: { id: ledgerId } });
		revalidatePath("/ledger");
		return { success: true, message: "Delete Ledger: Success" };
	} catch (error) {
		return handlePrismaError(error, "Ledger");
	}
};
