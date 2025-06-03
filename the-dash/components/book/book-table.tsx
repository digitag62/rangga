"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { BookProps } from "@/lib/book/types";
import { BookForm } from "@/components/book/form";
import { columns as getColumns } from "@/components/book/columns";

export const BookTableClient = ({ data }: { data: BookProps[] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<BookProps | null>(null);

	const columns = getColumns({ setIsOpen, setSelectedBook });

	return (
		<>
			<DataTable
				columns={columns}
				data={data}
				searchBy="name"
				url="/book"
				createForm={
					<Button
						variant="outline"
						className="text-foreground w-fit px-0 text-left"
						onClick={() => {
							setSelectedBook(null);
							setIsOpen(true);
						}}
					>
						<PlusCircle />
						New
					</Button>
				}
			/>

			<BookForm data={selectedBook} isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};
