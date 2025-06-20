"use client";

import * as React from "react";
import { IconCamera, IconCategory, IconDashboard, IconDatabase, IconFileAi, IconFileDescription, IconFileWord, IconFolders, IconHelp, IconMoneybag, IconReport, IconSearch, IconSettings, IconUsers, IconUserStar } from "@tabler/icons-react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import useAuthStore from "@/store/useAuthStore";

const data = {
	user: {
		id: "shadcn",
		email: "m@example.com",
		role: "USER",
		token: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			role: ["ADMIN", "USER"],
			icon: IconDashboard,
		},
		{
			title: "User",
			url: "/user",
			role: ["ADMIN"],
			icon: IconUsers,
		},
		{
			title: "Role",
			url: "/role",
			role: ["ADMIN"],
			icon: IconUserStar,
		},
		{
			title: "Book",
			url: "/book",
			role: ["ADMIN", "USER"],
			icon: IconFolders,
		},
		{
			title: "Category",
			url: "/cat",
			role: ["ADMIN", "USER"],
			icon: IconCategory,
		},
		{
			title: "Ledger",
			url: "/ledger",
			role: ["ADMIN", "USER"],
			icon: IconReport,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: IconCamera,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: IconFileDescription,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: IconDatabase,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const user = useAuthStore.useUser();
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
							<a href="#">
								<IconMoneybag className="!size-5" />
								<span className="text-base font-semibold">MoneysCorner.</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavDocuments items={data.documents} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
