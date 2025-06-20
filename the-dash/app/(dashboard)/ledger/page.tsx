import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { LedgerTableClient } from "@/components/ledger/ledger-table";
import { getCurrentSession } from "@/lib/actions";
import { notFound } from "next/navigation";

const LedgerPage = async () => {
	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div className="px-4 lg:px-6">
				<Suspense fallback={<div>Loading...</div>}>
					<Content />
				</Suspense>
			</div>
		</div>
	);
};

const Content = async () => {
	const session = await getCurrentSession();
	if (!session.success) return notFound();

	const data = await prismadb.ledger.findMany({
		select: {
			id: true,
			amount: true,
			remarks: true,
			type: true,
			book: {
				select: {
					id: true,
					name: true,
				},
			},
			cat: {
				select: {
					id: true,
					type: true,
					cat: true,
				},
			},
			userId: true,
			isActive: true,
		},
		where: { userId: session.data?.id ?? "" },
		// where: { NOT: { role: "ADMIN" } }, // example filter if needed
	});
	const books = await prismadb.book.findMany({
		select: { id: true, name: true },
		where: { userId: session.data?.id ?? "", isActive: true },
	});
	const cats = await prismadb.cat.findMany({
		select: { id: true, cat: true, type: true, book: { select: { id: true, name: true } } },
		where: { userId: session.data?.id ?? "", isActive: true },
	});

	return <LedgerTableClient data={data} books={books} cats={cats} />;
};

export default LedgerPage;
