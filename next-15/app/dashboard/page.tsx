import React from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const DashboardPage = async () => {
  const session = await auth();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl">Dashboard</h1>
        <p>Yo, welcome {session?.user?.email?.split("@")[0]}</p>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            type="submit"
            variant="link"
            className="font-mono text-emerald-200"
          >
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
