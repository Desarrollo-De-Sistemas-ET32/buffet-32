import Image from "next/image";
import UserList from '../components/UserList';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Usuarios</h1>
      <UserList />
    </main>
  );
}
