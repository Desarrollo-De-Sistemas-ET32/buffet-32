"use client"

import type React from "react"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageSquare, Headphones, Package } from "lucide-react"
import { useContactForm } from "@/hooks/useContact";
import Link from "next/link";

const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Ingresa un correo válido'),
  subject: z.string().min(1, 'El asunto es obligatorio'),
  category: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactTemplate() {
  const contactMutation = useContactForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const categoryValue = watch('category');

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visita nuestra tienda",
      details: ["123 Nut Street", "Fresh Valley, CA 90210", "Estados Unidos"],
    },
    {
      icon: Phone,
      title: "Llámanos",
      details: ["+1 (555) 123-NUTS", "+1 (555) 123-6887", "Lun-Vie: 9AM-6PM PST"],
    },
    {
      icon: Mail,
      title: "Escríbenos",
      details: ["hello@nuthaven.com", "support@nuthaven.com", "Respondemos en 24 horas"],
    },
    {
      icon: Clock,
      title: "Horario de atención",
      details: ["Lunes a viernes: 9AM - 6PM", "Sábado: 10AM - 4PM", "Domingo: Cerrado"],
    },
  ]

  const supportCategories = [
    {
      icon: Package,
      title: "Soporte de pedidos",
      description: "Preguntas sobre tu pedido, envíos o devoluciones",
    },
    {
      icon: MessageSquare,
      title: "Consultas de productos",
      description: "Información sobre nuestros productos, nutrición o recomendaciones",
    },
    {
      icon: Headphones,
      title: "Soporte general",
      description: "Problemas con la cuenta, el sitio web u otras consultas",
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-muted-foreground mb-4">Ponte en contacto</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas sobre nuestros productos o necesitas ayuda con tu pedido? ¡Estamos para ayudarte! 
            Escríbenos a nuestro equipo de atención al cliente.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="w-full border-none max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Envíanos un mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y te responderemos lo antes posible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Tu nombre completo"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="tu.correo@ejemplo.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select 
                      value={categoryValue} 
                      onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Soporte de pedidos</SelectItem>
                        <SelectItem value="product">Consulta de producto</SelectItem>
                        <SelectItem value="shipping">Pregunta sobre envío</SelectItem>
                        <SelectItem value="return">Devolución/Reembolso</SelectItem>
                        <SelectItem value="wholesale">Consulta mayorista</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      {...register('subject')}
                      placeholder="Descripción breve de tu consulta"
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-500">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Cuéntanos los detalles de tu consulta..."
                      rows={6}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Enviando..." : "Enviar mensaje"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support Categories */}
            <Card>
              <CardHeader>
                <CardTitle>¿Cómo podemos ayudarte?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg transition-colors"
                  >
                    <category.icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-muted-foreground">{category.title}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Response */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-muted-foreground mb-2">Respuesta rápida</h3>
                  <p className="text-sm text-muted-foreground">
                    Normalmente respondemos todas las consultas dentro de las 24 horas hábiles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-muted-foreground mb-4">¿Buscas respuestas rápidas?</h3>
              <p className="text-muted-foreground mb-6">
                Revisa nuestras preguntas frecuentes para obtener respuestas inmediatas a las dudas más comunes.
              </p>
              <Button asChild>
                <Link href="/faq">
                  Visitar preguntas frecuentes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
