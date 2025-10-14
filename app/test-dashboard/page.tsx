"use client";
import { useSession } from "next-auth/react";

export default function TestDashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return <div className="p-8">Not authenticated</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard</h1>
      <p>Welcome, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
      <p>Status: {status}</p>
    </div>
  );
}
