import { db } from './index';
import { users } from './schema';

const main = async () => {
  const data: (typeof users.$inferInsert)[] = [
    {
      fullName: 'Alice Johnson',
      phone: '555-0101',
    },
    {
      fullName: 'Bob Williams',
      phone: '555-0102',
    },
    {
      fullName: 'Charlie Brown',
      phone: '555-0103',
    },
  ];

  console.log('Seeding database...');

  // Clear existing data
  await db.delete(users);

  // Insert new data
  await db.insert(users).values(data);

  console.log('Database seeded successfully!');
  process.exit(0);
};

main().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
