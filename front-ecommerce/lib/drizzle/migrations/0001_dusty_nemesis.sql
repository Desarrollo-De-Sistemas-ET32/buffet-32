CREATE TABLE "huespedes" (
	"huesped_id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255),
	"dni" varchar(20)
);
--> statement-breakpoint
ALTER TABLE "ordenes" ADD COLUMN "huesped_id" integer;--> statement-breakpoint
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_huesped_id_huespedes_huesped_id_fk" FOREIGN KEY ("huesped_id") REFERENCES "public"."huespedes"("huesped_id") ON DELETE no action ON UPDATE no action;