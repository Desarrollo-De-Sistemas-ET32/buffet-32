CREATE TABLE "carritos" (
	"carrito_id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer,
	"producto_id" integer,
	"cantidad" integer
);
--> statement-breakpoint
CREATE TABLE "carritos_abandonados" (
	"carrito_abandonado_id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer,
	"fecha_abandono" date
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"categoria_id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"cliente_id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255),
	"email" varchar(255),
	"telefono" varchar(20),
	"puntos" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cupones" (
	"cupon_id" serial PRIMARY KEY NOT NULL,
	"ordenes_id" integer,
	"codigo" varchar(255),
	"descuento" numeric(5, 2),
	"fecha_vencimiento" date
);
--> statement-breakpoint
CREATE TABLE "ordenes" (
	"orden_id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer,
	"fecha_orden" date,
	"estado" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "ordenes_productos" (
	"orden_id" integer,
	"producto_id" integer,
	"cantidad" integer
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"pago_id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer,
	"monto" numeric(10, 2),
	"fecha_pago" date
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"producto_id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255),
	"descripcion" text,
	"precio" numeric(10, 2),
	"imagen" varchar(255),
	"categoria_id" integer
);
--> statement-breakpoint
CREATE TABLE "recaudaciones" (
	"recaudacion_id" serial PRIMARY KEY NOT NULL,
	"sucursal_id" integer,
	"monto_recaudado" numeric(10, 2),
	"fecha_recaudacion" date
);
--> statement-breakpoint
CREATE TABLE "reservas" (
	"reserva_id" serial PRIMARY KEY NOT NULL,
	"sucursal_id" integer,
	"cliente_id" integer,
	"fecha_reserva" date
);
--> statement-breakpoint
CREATE TABLE "sucursales" (
	"sucursal_id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255),
	"direccion" varchar(255),
	"telefono" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"phone" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_cliente_id_clientes_cliente_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("cliente_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_producto_id_productos_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("producto_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carritos_abandonados" ADD CONSTRAINT "carritos_abandonados_cliente_id_clientes_cliente_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("cliente_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cupones" ADD CONSTRAINT "cupones_ordenes_id_ordenes_orden_id_fk" FOREIGN KEY ("ordenes_id") REFERENCES "public"."ordenes"("orden_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_cliente_id_clientes_cliente_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("cliente_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_productos" ADD CONSTRAINT "ordenes_productos_orden_id_ordenes_orden_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes"("orden_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_productos" ADD CONSTRAINT "ordenes_productos_producto_id_productos_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("producto_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cliente_id_clientes_cliente_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("cliente_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_categorias_categoria_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("categoria_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recaudaciones" ADD CONSTRAINT "recaudaciones_sucursal_id_sucursales_sucursal_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("sucursal_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_sucursal_id_sucursales_sucursal_id_fk" FOREIGN KEY ("sucursal_id") REFERENCES "public"."sucursales"("sucursal_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_cliente_id_clientes_cliente_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("cliente_id") ON DELETE no action ON UPDATE no action;