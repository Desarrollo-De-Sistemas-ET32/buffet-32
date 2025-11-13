import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border text-muted-foreground py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand/Description */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">NutHaven</h3>
          <p className="text-sm">Frutos secos premium para una vida más saludable. Frescos, nutritivos y entregados con cuidado.</p>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Enlaces rápidos</h4>
          <ul className="space-y-1">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li><Link href="/products" className="hover:underline">Tienda</Link></li>
            <li><Link href="/about" className="hover:underline">Nosotros</Link></li>
            <li><Link href="/contact" className="hover:underline">Contacto</Link></li>
          </ul>
        </div>
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Categorías</h4>
          <ul className="space-y-1">
            <li><Link href="/products?category=nuecess" className="hover:underline">Nueces</Link></li>
            <li><Link href="/products?category=fruto-seco" className="hover:underline">Fruto seco</Link></li>
            <li><Link href="/products?category=raw-nuts" className="hover:underline">Nueces crudas</Link></li>
            <li><Link href="/products?category=mixed-nuts" className="hover:underline">Mezcla de frutos secos</Link></li>
          </ul>
        </div>
        {/* Support */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Soporte</h4>
          <ul className="space-y-1">
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:underline">Envíos</Link></li>
            <li><Link href="/returns" className="hover:underline">Devoluciones</Link></li>
            <li><Link href="/help" className="hover:underline">Ayuda</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NutHaven. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer
