import { pgTable, serial, text, varchar, integer, decimal, date } from "drizzle-orm/pg-core";

// Tabla 'users'
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

// Tabla 'sucursales'
export const sucursales = pgTable('sucursales', {
  sucursal_id: serial('sucursal_id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }),
  direccion: varchar('direccion', { length: 255 }),
  telefono: varchar('telefono', { length: 20 }),
});

export const categorias = pgTable('categorias', {
  categoria_id: serial('categoria_id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }),
});

export const clientes = pgTable('clientes', {
  cliente_id: serial('cliente_id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }),
  email: varchar('email', { length: 255 }),
  telefono: varchar('telefono', { length: 20 }),
  puntos: integer('puntos').default(0),
});

export const ordenes = pgTable('ordenes', {
  orden_id: serial('orden_id').primaryKey(),
  cliente_id: integer('cliente_id').references(() => clientes.cliente_id),
  fecha_orden: date('fecha_orden'),
  estado: varchar('estado', { length: 50 }),
});

export const productos = pgTable('productos', {
  producto_id: serial('producto_id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }),
  descripcion: text('descripcion'),
  precio: decimal('precio', { precision: 10, scale: 2 }),
  imagen: varchar('imagen', { length: 255 }),
  categoria_id: integer('categoria_id').references(() => categorias.categoria_id),
});

export const recaudaciones = pgTable('recaudaciones', {
  recaudacion_id: serial('recaudacion_id').primaryKey(),
  sucursal_id: integer('sucursal_id').references(() => sucursales.sucursal_id),
  monto_recaudado: decimal('monto_recaudado', { precision: 10, scale: 2 }),
  fecha_recaudacion: date('fecha_recaudacion'),
});

export const cupones = pgTable('cupones', {
  cupon_id: serial('cupon_id').primaryKey(),
  ordenes_id: integer('ordenes_id').references(() => ordenes.orden_id),
  codigo: varchar('codigo', { length: 255 }),
  descuento: decimal('descuento', { precision: 5, scale: 2 }),
  fecha_vencimiento: date('fecha_vencimiento'),
});

export const carritos = pgTable('carritos', {
  carrito_id: serial('carrito_id').primaryKey(),
  cliente_id: integer('cliente_id').references(() => clientes.cliente_id),
  producto_id: integer('producto_id').references(() => productos.producto_id),
  cantidad: integer('cantidad'),
});

export const ordenes_productos = pgTable('ordenes_productos', {
  orden_id: integer('orden_id').references(() => ordenes.orden_id),
  producto_id: integer('producto_id').references(() => productos.producto_id),
  cantidad: integer('cantidad'),
});

export const pagos = pgTable('pagos', {
  pago_id: serial('pago_id').primaryKey(),
  cliente_id: integer('cliente_id').references(() => clientes.cliente_id),
  monto: decimal('monto', { precision: 10, scale: 2 }),
  fecha_pago: date('fecha_pago'),
});

export const reservas = pgTable('reservas', {
  reserva_id: serial('reserva_id').primaryKey(),
  sucursal_id: integer('sucursal_id').references(() => sucursales.sucursal_id),
  cliente_id: integer('cliente_id').references(() => clientes.cliente_id),
  fecha_reserva: date('fecha_reserva'),
});

export const carritos_abandonados = pgTable('carritos_abandonados', {
  carrito_abandonado_id: serial('carrito_abandonado_id').primaryKey(),
  cliente_id: integer('cliente_id').references(() => clientes.cliente_id),
  fecha_abandono: date('fecha_abandono'),
});