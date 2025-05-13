import Image from "next/image";

export default function Home() {
	return (
		<main className="flex flex-col row-start-2 gap-[24px] ">
			<h1>Hello, welcome.</h1>
			<ol className="list-inside list-decimal text-sm/6 font-[family-name:var(--font-geist-mono)] text-muted-foreground">
				<li className="tracking-[-.01em]">Lorem ipsum dolor sit amet.</li>
				<li className="tracking-[-.01em]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore.</li>
			</ol>
			<div className="flex gap-4 items-center">
				<a href="https://rgdmprmd.com" className="flex items-center gap-2 hover:underline hover:underline-offset-4" target="_blank">
					Lets Talk!
				</a>
			</div>
		</main>
	);
}
