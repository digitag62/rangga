import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { UserTableClient } from "@/components/user/user-table";

const UserPage = () => {
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
	const data = await prismadb.user.findMany({ select: { id: true, email: true, isActive: true, role: { select: { id: true, role: true } } } });
	const roles = await prismadb.role.findMany({ select: { role: true, id: true, isActive: true }, where: { isActive: true } });

	return <UserTableClient data={data} roles={roles} />;
};

export default UserPage;
