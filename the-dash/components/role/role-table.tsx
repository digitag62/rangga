"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { RoleForm } from "@/components/role/role-form";
import { Button } from "@/components/ui/button";
import { columns as getColumns } from "@/components/role/role-columns";
import { PlusCircle } from "lucide-react";
import { RoleProps } from "@/lib/role/types";

export const RoleTableClient = ({ data }: { data: RoleProps[] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState<RoleProps | null>(null);

	const columns = getColumns({ setIsOpen, setSelectedRole });

	return (
		<>
			<DataTable
				columns={columns}
				data={data}
				searchBy="role"
				url="/role"
				createForm={
					<Button
						variant="outline"
						className="text-foreground w-fit px-0 text-left"
						onClick={() => {
							setSelectedRole(null); // For "New"
							setIsOpen(true);
						}}
					>
						<PlusCircle />
						New
					</Button>
				}
			/>

			<RoleForm data={selectedRole} isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};
