"use client";

import { Button } from "@/components/ui/button";
import { seedRole } from "@/lib/actions";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
	const [load, setLoad] = useState(false);

	const handleSeed = async () => {
		const res = await seedRole();
		setLoad(true);

		if (!res.success) {
			toast.error("Seed failed dude, try again");
			setLoad(false);
		} else {
			toast.success("Seed success, now you can do shit");
			setLoad(false);
		}
	};
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<Link href="/login" prefetch={true} className="text-muted-foreground hover:text-accent-foreground hover:underline hover:underline-offset-4">
					Get Started
				</Link>
				<Button onClick={handleSeed} disabled={load}>
					{load ? "Loading..." : "Seed Role"}
				</Button>
			</main>
		</div>
	);
}
