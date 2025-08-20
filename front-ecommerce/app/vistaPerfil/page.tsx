import Link from 'next/link';
import { FunctionComponent } from 'react';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { LiaHistorySolid } from 'react-icons/lia';
import { IoHeartOutline, IoSettingsOutline } from 'react-icons/io5';
import { BsBag } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
}

interface User {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orders: Order[];
}

const placeholderUser: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    country: 'USA',
  },
  orders: [
    { id: '12345', date: '2023-10-26', total: '$55.00', status: 'Delivered' },
    { id: '67890', date: '2023-10-20', total: '$120.00', status: 'Shipped' },
    { id: '11223', date: '2023-10-15', total: '$30.00', status: 'Delivered' },
  ],
};

const UserDashboard: FunctionComponent = () => {
  const user = placeholderUser;

  const navItems = [
    { name: 'Dashboard', icon: IoSpeedometerOutline, active: true },
    { name: 'Order History', icon: LiaHistorySolid, active: false },
    { name: 'Wishlist', icon: IoHeartOutline, active: false },
    { name: 'Shopping Cart', icon: BsBag, active: false },
    { name: 'Settings', icon: IoSettingsOutline, active: false },
    { name: 'Log-out', icon: FiLogOut, active: false },
  ];

  return (
 <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      <aside className="w-full md:w-1/4 p-6">
        <nav>
          <h3 className="mb-6 text-lg font-semibold text-gray-700">Navigation</h3>
          <ul className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href="#"
                    className={`flex items-center rounded-md p-3 transition-colors ${
                      item.active
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* User Information Card */}
          <section className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-300">
              {/* Placeholder for profile picture */}
            </div>
            <h2 className="mb-1 text-xl font-bold text-gray-800">Dianne Russell</h2>
            <p className="mb-4 text-sm text-gray-600">Customer</p>
            <button className="text-green-700 hover:underline">
              Edit Profile
            </button>
          </section>

          {/* Billing Address Card */}
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold uppercase text-gray-600">
              Billing Address
            </h2>
            <div className="text-gray-800 text-center">
              <p className="font-semibold">Dainne Russell</p>
              <p>4140 Parker Rd.</p>
              <p>Allentown, New Mexico 31134</p>
              <p className="mt-2">{user.email}</p>
              <p>(671) 555-0110</p>
            </div>
            <div className="mt-4 text-center">
              <button className="text-green-700 hover:underline">
                Edit Address
              </button>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Order History
            </h2>
            <Link href="#" className="text-green-700 hover:underline">
              View All
            </Link>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">View Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {user.orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.status}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link href="#" className="text-green-700 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;