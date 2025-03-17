import React from "react";

import { auth } from "@/auth";

const DashboardPage = async () => {
  const session = await auth();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl">Dashboard</h1>
        <p>Yo, welcome {session?.user?.email?.split("@")[0]}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
