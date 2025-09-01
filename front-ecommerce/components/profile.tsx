// components/profile/ProfileNavigation.tsx
import Link from 'next/link';
import { LiaHistorySolid } from 'react-icons/lia';
import { IoHeartOutline, IoSettingsOutline } from 'react-icons/io5';
import { BsBag } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md'; // Assuming this icon for Dashboard

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export default function ProfileNavigation() {
  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '#', icon: <MdDashboard />, isActive: true },
    { name: 'Order History', href: '#', icon: <LiaHistorySolid /> },
    { name: 'Wishlist', href: '#', icon: <IoHeartOutline /> },
    { name: 'Shopping Cart', href: '#', icon: <BsBag /> },
    { name: 'Settings', href: '#', icon: <IoSettingsOutline /> },
    { name: 'Log-out', href: '#', icon: <FiLogOut /> },
  ];

  return (
    <div className="w-full md:w-1/4 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold mb-6">Navigation</h2>
      <ul>
        {navigationItems.map((item) => (
          <li key={item.name} className="mb-4">
            <Link href={item.href}>
              <div className={`flex items-center p-2 rounded-md ${item.isActive ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-200'}`}>
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```typescript
// components/profile/UserProfileCard.tsx
import Image from 'next/image';

interface UserProfileProps {
  name: string;
  role: string;
  imageUrl?: string;
}

export default function UserProfileCard({ name, role, imageUrl }: UserProfileProps) {
  return (
    <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center text-center w-full md:w-1/2 lg:w-2/5 mr-4 mb-4 md:mb-0">
      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
        {imageUrl ? (
          <Image src={imageUrl} alt={`${name}'s profile picture`} layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
            JD {/* Placeholder initials */}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-gray-600 mb-4">{role}</p>
      <button className="text-green-700 hover:underline focus:outline-none">
        Edit Profile
      </button>
    </div>
  );
}
```

```typescript
// components/profile/BillingAddressCard.tsx
interface BillingAddressProps {
  name: string;
  address: string;
  cityStateZip: string;
  country: string;
  email: string;
  phone: string;
}

export default function BillingAddressCard({ name, address, cityStateZip, country, email, phone }: BillingAddressProps) {
  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full md:w-1/2 lg:w-3/5 mb-4 md:mb-0">
      <h3 className="text-sm text-gray-500 uppercase font-semibold mb-4">BILLING ADDRESS</h3>
      <div className="text-gray-700 text-center md:text-left">
        <p>{name}</p>
        <p>{address}</p>
        <p>{cityStateZip}</p>
        <p className="mb-4">{country}</p>
        <p>{email}</p>
        <p>{phone}</p>
      </div>
      <div className="mt-4 text-center md:text-left">
        <button className="text-green-700 hover:underline focus:outline-none">
          Edit Address
        </button>
      </div>
    </div>
  );
}
```

```typescript
// components/profile/OrderHistoryTable.tsx
interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistoryTable({ orders }: OrderHistoryProps) {
  return (
    <div className="bg-white p-6 rounded-md shadow-md mt-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Order History</h3>
        <button className="text-green-700 hover:underline focus:outline-none">
          View All
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ORDER ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DATE
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TOTAL
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              STATUS
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View Details</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-green-700 hover:underline focus:outline-none">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}