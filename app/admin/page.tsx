import React from "react";
import UsersSection from "./users/page";
export default function AdminHomePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <UsersSection />
    </div>
  );
}
