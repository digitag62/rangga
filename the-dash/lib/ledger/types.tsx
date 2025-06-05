export type LedgerProps = {
	id: string;
	amount: number;
	remarks: string;
	type: "EXP" | "ERN" | "SAV" | "TRF";
	userId: string;
	isActive: boolean;
	cat: {
		id: string;
		type: "EXP" | "ERN" | "SAV" | "TRF";
		cat: string;
	};
	book: {
		id: string;
		name: string;
	};
};

export type LedgerPayload = {
	type: "EXP" | "ERN" | "SAV" | "TRF";
	amount: number;
	remarks: string;
	catId: string;
	bookId: string;
	isActive: string;
};
