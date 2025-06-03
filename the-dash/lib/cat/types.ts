export type CatProps = {
	cat: string;
	type: "EXP" | "ERN" | "SAV" | "TRF";
	id: string;
	max: number;
	userId: string;
	isActive: boolean;
	book: {
		id: string;
		name: string;
	};
};

export type CatPayload = {
	bookId: string;
	type: "EXP" | "ERN" | "SAV" | "TRF";
	cat: string;
	max: number;
	isActive: string;
};
