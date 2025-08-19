import { db } from './index';
import { users, sucursales, categorias, clientes, productos, ordenes, recaudaciones, cupones, carritos, ordenes_productos, pagos, reservas, carritos_abandonados } from './schema';

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

  // Clear existing data (order matters due to foreign key constraints)
  await db.delete(carritos_abandonados);
  await db.delete(reservas);
  await db.delete(pagos);
  await db.delete(ordenes_productos);
  await db.delete(carritos);
  await db.delete(cupones);
  await db.delete(ordenes);
  await db.delete(recaudaciones);
  await db.delete(productos);
  await db.delete(clientes);
  await db.delete(categorias);
  await db.delete(sucursales);
  // Clear existing data
  await db.delete(users);

  // Insert new data
  await db.insert(users).values(data);

  // Seed sucursales
  const sucursalesData: (typeof sucursales.$inferInsert)[] = [
    { nombre: 'Sucursal Centro', direccion: 'Calle Principal 123', telefono: '555-1111' },
    { nombre: 'Sucursal Norte', direccion: 'Avenida Siempre Viva 456', telefono: '555-2222' },
  ];
  await db.insert(sucursales).values(sucursalesData);

  // Seed categorias
  const categoriasData: (typeof categorias.$inferInsert)[] = [
    { nombre: 'Electrónica' },
    { nombre: 'Libros' },
    { nombre: 'Ropa' },
  ];
  await db.insert(categorias).values(categoriasData);

  // Seed clientes
  const clientesData: (typeof clientes.$inferInsert)[] = [
    { nombre: 'Ana Perez', email: 'ana.perez@example.com', telefono: '555-3333', puntos: 100 },
    { nombre: 'Juan Rodriguez', email: 'juan.rodriguez@example.com', telefono: '555-4444', puntos: 50 },
  ];
  await db.insert(clientes).values(clientesData);

  // Seed productos (needs categorias)
  const productosData: (typeof productos.$inferInsert)[] = [
    { nombre: 'Laptop X', descripcion: 'Potente laptop para trabajo', precio: '1200.00', imagen: '/images/laptop.jpg', categoria_id: 1 },
    { nombre: 'El Gran Libro', descripcion: 'Una historia fascinante', precio: '25.50', imagen: '/images/book.jpg', categoria_id: 2 },
    { nombre: 'Camiseta Cool', descripcion: 'Camiseta de algodón', precio: '30.00', imagen: '/images/tshirt.jpg', categoria_id: 3 },
  ];
  await db.insert(productos).values(productosData);

  // Seed ordenes (needs clientes)
  const ordenesData: (typeof ordenes.$inferInsert)[] = [
    { cliente_id: 1, fecha_orden: '2023-10-26', estado: 'Completada' },
    { cliente_id: 2, fecha_orden: '2023-10-25', estado: 'Pendiente' },
  ];
  await db.insert(ordenes).values(ordenesData);

  // Seed recaudaciones (needs sucursales)
  const recaudacionesData: (typeof recaudaciones.$inferInsert)[] = [
    { sucursal_id: 1, monto_recaudado: '5000.00', fecha_recaudacion: '2023-10-26' },
    { sucursal_id: 2, monto_recaudado: '3000.00', fecha_recaudacion: '2023-10-25' },
  ];
  await db.insert(recaudaciones).values(recaudacionesData);

  // Seed cupones (needs ordenes)
  const cuponesData: (typeof cupones.$inferInsert)[] = [
    { ordenes_id: 1, codigo: 'DESC10', descuento: '10.00', fecha_vencimiento: '2024-12-31' },
  ];
  await db.insert(cupones).values(cuponesData);

  // Seed carritos (needs clientes and productos)
  const carritosData: (typeof carritos.$inferInsert)[] = [
    { cliente_id: 1, producto_id: 2, cantidad: 1 },
    { cliente_id: 2, producto_id: 1, cantidad: 1 },
    { cliente_id: 2, producto_id: 3, cantidad: 2 },
  ];
  await db.insert(carritos).values(carritosData);

  // Seed ordenes_productos (needs ordenes and productos)
  const ordenesProductosData: (typeof ordenes_productos.$inferInsert)[] = [
    { orden_id: 1, producto_id: 1, cantidad: 1 },
    { orden_id: 1, producto_id: 3, cantidad: 2 },
    { orden_id: 2, producto_id: 2, cantidad: 1 },
  ];
  await db.insert(ordenes_productos).values(ordenesProductosData);

  // Seed pagos (needs clientes)
  const pagosData: (typeof pagos.$inferInsert)[] = [
    { cliente_id: 1, monto: '180.00', fecha_pago: '2023-10-26' },
    { cliente_id: 2, monto: '25.50', fecha_pago: '2023-10-25' },
  ];
  await db.insert(pagos).values(pagosData);

  // Seed reservas (needs sucursales and clientes)
  const reservasData: (typeof reservas.$inferInsert)[] = [
    { sucursal_id: 1, cliente_id: 1, fecha_reserva: '2023-11-15' },
    { sucursal_id: 2, cliente_id: 2, fecha_reserva: '2023-11-20' },
  ];
  await db.insert(reservas).values(reservasData);

  // Seed carritos_abandonados (needs clientes)
  const carritosAbandonadosData: (typeof carritos_abandonados.$inferInsert)[] = [
    { cliente_id: 1, fecha_abandono: '2023-10-20' },
  ];
  await db.insert(carritos_abandonados).values(carritosAbandonadosData);

  console.log('Database seeded successfully!');
  process.exit(0);
};

main().catch((err) => {
  console.error('Error seeding database:', err);process.exit(1);});

























