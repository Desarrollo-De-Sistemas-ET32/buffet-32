import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600">
        Esta es una página protegida. Solo los usuarios autenticados pueden verla.
      </p>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tu ID de Usuario</h2>
        <p className="font-mono bg-gray-100 p-2 rounded">{userId}</p>
      </div>
    </div>
  );
} 