import type { Menu } from 'lib/shopify/types';

// Local, static menu without Shopify
const staticMenu: Menu[] = [
  { title: 'Home', path: '/' },
  { title: 'Search', path: '/search' }
];

export function getMenu(_handle: string): Menu[] {
  return staticMenu;
}
