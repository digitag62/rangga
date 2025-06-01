import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions";
import HydrateZustand from "@/components/hydrate-zustand";

export default async function Layout({ children }: { children: React.ReactNode }) {
	const token = (await cookies()).get("token")?.value;
	if (!token) redirect("/login");

	const user = await getCurrentUser(token); // decode, DB lookup, etc.
	if (!user) redirect("/login");

	return (
		<HydrateZustand user={user.data}>
			<SidebarProvider
				style={
					{
						"--sidebar-width": "calc(var(--spacing) * 72)",
						"--header-height": "calc(var(--spacing) * 12)",
					} as React.CSSProperties
				}
			>
				<AppSidebar variant="inset" />
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col">
						<div className="@container/main flex flex-1 flex-col gap-2">{children}</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</HydrateZustand>
	);
}
