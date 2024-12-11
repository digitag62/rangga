import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-1">
      <h2 className="font-mono">404: Page not found boys!</h2>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "link" }), "font-mono")}
      >
        Bring me back home
      </Link>
    </div>
  );
};

export default NotFound;
