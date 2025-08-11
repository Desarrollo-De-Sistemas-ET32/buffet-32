import { db } from '@/lib/drizzle';
import { users } from '@/lib/drizzle/schema';

// Revalidate the page every 5 seconds
export const revalidate = 5;

export default async function UsersPage() {
  const allUsers = await db.select().from(users);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Users</h1>
      <ul style={{ listStyle: 'disc', paddingLeft: '2rem', marginTop: '1rem' }}>
        {allUsers.map((user) => (
          <li key={user.id}>
            <strong>{user.fullName}</strong> - <span>{user.phone}</span>
          </li>
        ))}
      </ul>
      {allUsers.length === 0 && <p>No users found. Try adding one!</p>}
    </div>
  );
}
