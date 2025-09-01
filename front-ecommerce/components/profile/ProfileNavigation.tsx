import Link from 'next/link';
import { LiaHistorySolid } from 'react-icons/lia';
import { IoHeartOutline, IoSettingsOutline } from 'react-icons/io5';
import { BsBag } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { MdDashboard } from "react-icons/md";
import { useState } from 'react';

interface ProfileNavigationProps {
  activeItem: 'dashboard' | 'order-history' | 'wishlist' | 'shopping-cart' | 'settings' | 'log-out';
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeItem }) => {
  const menuItems = [
    { name: 'Dashboard', href: '#', icon: MdDashboard, key: 'dashboard' },
    { name: 'Order History', href: '#', icon: LiaHistorySolid, key: 'order-history' },
    { name: 'Wishlist', href: '#', icon: IoHeartOutline, key: 'wishlist' },
    { name: 'Shopping Cart', href: '#', icon: BsBag, key: 'shopping-cart' },
    { name: 'Settings', href: '#', icon: IoSettingsOutline, key: 'settings' },
    { name: 'Log-out', href: '#', icon: FiLogOut, key: 'log-out' },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md md:w-auto w-full">
      <div className="flex justify-between items-center md:block">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Navigation</h2>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      <ul className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        {menuItems.map((item) => (
          <li key={item.key} className="mb-2">
            <Link href={item.href} passHref>
              {/* eslint-disable-next-line @next/next/no-analytic-html-attribute */}
              <a
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 ${activeItem === item.key
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="mr-3 text-xl" />
                <span>{item.name}</span>
              </a>

            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileNavigation;