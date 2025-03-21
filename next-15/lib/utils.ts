import { clsx, type ClassValue } from "clsx";
import { Command, Settings2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (name: string) => {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with a dash
    .replace(/[^\w\-]+/g, "") // Remove any non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple dashes with a single dash
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, ""); // Remove trailing dashes
};

// This is sample data.
export const links = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "USER",
  },
  teams: [
    // {
    //   name: "Acme Inc",
    //   logo: GalleryVerticalEnd,
    //   plan: "Enterprise",
    // },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
          access: ["USER", "ADMIN"],
        },
        {
          title: "Role",
          url: "/dashboard/settings/role",
          access: ["ADMIN"],
        },
        {
          title: "User",
          url: "/dashboard/settings/user",
          access: ["ADMIN"],
        },
        {
          title: "NavGroup",
          url: "/dashboard/settings/nav-group",
          access: ["ADMIN"],
        },
        {
          title: "Nav",
          url: "/dashboard/settings/nav",
          access: ["ADMIN"],
        },
      ],
    },
    /*{
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },*/
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
};
