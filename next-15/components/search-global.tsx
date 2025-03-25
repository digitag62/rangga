"use client";

import * as React from "react";
import { Navigation } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "@radix-ui/react-dialog";
import { links } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import DynamicIcon from "./dynamic-icon";
import { signOut } from "next-auth/react";

export function SearchGlobal() {
  const [open, setOpen] = React.useState(false);
  const { navMain } = links;
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="ml-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-sm text-muted-foreground"
      >
        Search menu{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only"></DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Nav Group">
            {navMain.map((nav) => (
              <CommandItem
                key={nav.url}
                onSelect={() => {
                  router.push(nav.url);
                  setOpen(false);
                }}
              >
                <DynamicIcon name="settings-2" className="text-sm" />
                <span>{nav.title}</span>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                setOpen(false);
                signOut();
              }}
            >
              <DynamicIcon name="log-out" className="text-sm" />
              <span>Log out</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Nav Links">
            {navMain.map((nav) =>
              nav.items.map((item) => (
                <CommandItem
                  key={item.url}
                  onSelect={() => {
                    router.push(item.url);
                    setOpen(false);
                  }}
                >
                  <Navigation size="sm" />
                  <span>{item.title}</span>
                  {/* <CommandShortcut>⌘P</CommandShortcut> */}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
