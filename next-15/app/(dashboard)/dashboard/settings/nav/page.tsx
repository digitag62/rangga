import React from "react";
import Link from "next/link";

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl">Navigation settings</h1>
        <Link href="/dashboard/settings/nav/create-group">Create NavGroup</Link>
        <Link href="/dashboard/settings/nav/create">Create NavLink</Link>
      </div>
    </div>
  );
};

export default SettingsPage;
