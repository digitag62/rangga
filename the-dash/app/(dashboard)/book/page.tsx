import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { BookTableClient } from "@/components/book/book-table";
import NotFound from "@/app/not-found";
import { getCurrentSession } from "@/lib/actions";

const BookPage = async () => {
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
	if (!session.success) return NotFound();

	const data = await prismadb.book.findMany({
		select: {
			id: true,
			name: true,
			summary: true,
			userId: true,
			isActive: true,
		},
		where: { userId: session?.data?.id! },
	});

	return <BookTableClient data={data} />;
};

export default BookPage;
