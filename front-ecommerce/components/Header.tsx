'use client';

import Link from 'next/link';
import { Package, Home, Settings, Menu, ShoppingCart, User, LogOut, LogIn, HelpCircle, TrendingUp, Star, Percent, Flame } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import CartDrawer from './CartDrawer';
import { useAuth } from '@/context/auth-context';
import { useLogoutUser } from '@/hooks/useAuth';
import HeaderSearchBar from './HeaderSearchBar';
import { fetchMegamenuCategoriesAction } from '@/actions/category';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { isAuthenticated, logout, isAdmin, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const logoutMutation = useLogoutUser();
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['megamenu-categories'],
    queryFn: () => fetchMegamenuCategoriesAction(),
  });

  const handleLogout = async () => {
    try {
      await logout();
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isDark = theme === "dark";

  const categoriesArray = Array.isArray(categories?.data) ? categories?.data : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-0">
        <div className="flex items-center space-x-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px]">
              <SheetTitle className='sr-only'>Menú</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8 p-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Inicio</span>
                </Link>
                <Link
                  href="/products"
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  <span>Productos</span>
                </Link>
                {!isLoading && (
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                )}
                {isLoading ? (
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Iniciar sesión</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Registrarse</span>
                    </Link>
                  </>
                ) : (
                  <>
                    {!isLoading && isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Panel de administración</span>
                      </Link>
                    )}
                    {!isLoading && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary justify-start p-0 h-auto"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                      </Button>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            {/* <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Store</span> */}
            <Image
              src="https://marketplace.canva.com/EAGGDjg4BSY/1/0/1600w/canva-logo-parrilla-argentina-circular-marr%C3%B3n-y-negro-VN3qR8Fda0M.jpg"
              alt="Logo"
              width={100}
              height={100}
              className="hover:opacity-75 duration-300 transition-all"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Link
                href="/products"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <Package className="h-4 w-4" />
                <span>Productos</span>
              </Link>

              {showMegaMenu && (
                <div className="absolute top-full left-0 w-full h-2 bg-transparent" />
              )}

              {/* Mega Menu */}
              {showMegaMenu && (
                <motion.div
                  className="absolute top-full left-0 w-[800px] bg-card border border-border rounded-lg shadow-lg p-6 z-50 mt-2"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.2
                  }}
                >
                  <motion.div
                    className="grid grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.1
                        }
                      }
                    }}
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Categorías
                      </h3>
                      <ul className="space-y-2">
                        {categoriesLoading ? (
                          <div className='flex flex-col gap-2'>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ) : (
                          categoriesArray.map((category, index) => (
                            <motion.li
                              key={category.name}
                              variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                delay: index * 0.05
                              }}
                            >
                              <Link
                                href={`/products?category=${category.slug}`}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1"
                              >
                                {category.name}
                              </Link>
                            </motion.li>
                          ))
                        )}
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            delay: 0.3
                          }}
                        >
                          <Link
                            href="/products"
                            className="text-sm text-primary hover:text-primary/80 transition-colors block py-1 font-medium"
                          >
                            Ver todas las categorías →
                          </Link>
                        </motion.li>
                      </ul>
                    </motion.div>

                    {/* Sale Items */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Percent className="h-4 w-4 text-red-500" />
                        Ofertas
                      </h3>
                      <ul className="space-y-2">
                        {[
                          { href: "/products?withDiscount=true", text: "Hasta 50% de descuento" },
                          { href: "/products?withDiscount=true", text: "Liquidación" },
                          { href: "/products?withDiscount=true", text: "Ofertas relámpago" },
                          { href: "/products?withDiscount=true", text: "Ver todas las ofertas →", isPrimary: true }
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            variants={{
                              hidden: { opacity: 0, x: -10 },
                              visible: { opacity: 1, x: 0 }
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                              delay: index * 0.05
                            }}
                          >
                            <Link
                              href={item.href}
                              className={`text-sm transition-colors block py-1 ${item.isPrimary
                                ? "text-primary hover:text-primary/80 font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                              {item.text}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Top Sellers */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Más vendidos
                      </h3>
                      <ul className="space-y-2">
                        {[
                          { href: "/products?featured=true", text: "Mejor valorados" },
                          { href: "/products?featured=true", text: "Más populares" },
                          { href: "/products?featured=true", text: "Favoritos de clientes" },
                          { href: "/products?featured=true", text: "Ver más vendidos →", isPrimary: true }
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            variants={{
                              hidden: { opacity: 0, x: -10 },
                              visible: { opacity: 1, x: 0 }
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                              delay: index * 0.05
                            }}
                          >
                            <Link
                              href={item.href}
                              className={`text-sm transition-colors block py-1 ${item.isPrimary
                                ? "text-primary hover:text-primary/80 font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                              {item.text}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Special Offers */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Ofertas especiales
                      </h3>
                      <ul className="space-y-2">
                        {[
                          { href: "/products?featured=true", text: "Novedades" },
                          { href: "/products?featured=true", text: "Edición limitada" },
                          { href: "/products?featured=true", text: "Productos de temporada" },
                          { href: "/products?featured=true", text: "Ver todas las ofertas →", isPrimary: true }
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            variants={{
                              hidden: { opacity: 0, x: -10 },
                              visible: { opacity: 1, x: 0 }
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                              delay: index * 0.05
                            }}
                          >
                            <Link
                              href={item.href}
                              className={`text-sm transition-colors block py-1 ${item.isPrimary
                                ? "text-primary hover:text-primary/80 font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                              {item.text}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {isLoading ? (
              <>
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </>
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar sesión</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  <span>Registrarse</span>
                </Link>
              </>
            ) : (
              <>

              </>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <HeaderSearchBar />
          <CartDrawer />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              {!isLoading && isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Panel de administración</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center space-x-2">
                  <span>Modo oscuro</span>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </DropdownMenuItem>

              {!isLoading && isAuthenticated && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className=""
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
