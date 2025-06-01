import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { RoleTableClient } from "@/components/role-table";

const RolePage = async () => {
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
	const data = await prismadb.role.findMany({ select: { id: true, role: true, isActive: true }, where: { NOT: { role: "ADMIN" } } });

	// return <DataTable columns={columns} data={data} searchBy="role" url="/role" createForm={<RoleForm data={null} />} />;
	return <RoleTableClient data={data} />;
};
export default RolePage;
