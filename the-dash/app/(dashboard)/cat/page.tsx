import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { CatTableClient } from "@/components/cat/cat-table";
import { getCurrentSession } from "@/lib/actions";
import { notFound } from "next/navigation";

const CatPage = async () => {
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

	const data = await prismadb.cat.findMany({
		select: {
			id: true,
			type: true,
			cat: true,
			max: true,
			book: {
				select: { id: true, name: true },
			},
			userId: true,
			isActive: true,
		},
		where: { userId: session?.data?.id! },
	});
	const books = await prismadb.book.findMany({
		select: { id: true, name: true },
		where: { userId: session?.data?.id!, isActive: true },
	});

	return <CatTableClient data={data} books={books} />;
};

export default CatPage;
