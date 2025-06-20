export type CatProps = {
	id: string;
	cat: string;
	type: "EXP" | "ERN" | "SAV" | "TRF";
	max?: number;
	userId?: string;
	isActive?: boolean;
	book?: {
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
