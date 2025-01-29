"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Kundan",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "My Documents",
      url: "/templates",
      isActive: true,
      icon: SquareTerminal,
      items: [
        {
          title: "All",
          url: "/all",
        },
        {
          title: "Recent",
          url: "/recent",
        },
        {
          title: "Archived",
          url: "/archived",
        },
      ],
    },

    {
      title: "My Documents",
      url: "/templates",
      isActive: true,
      icon: SquareTerminal,
      items: [
        {
          title: "All",
          url: "/all",
        },
        {
          title: "Recent",
          url: "/recent",
        },
        {
          title: "Archived",
          url: "/archived",
        },
      ],
    },
    {
      title: "My Documents",
      url: "/templates",
      isActive: true,
      icon: SquareTerminal,
      items: [
        {
          title: "All",
          url: "/all",
        },
        {
          title: "Recent",
          url: "/recent",
        },
        {
          title: "Archived",
          url: "/archived",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
