"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, MessageSquare } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getFaqs } from "@/actions/faq"
import Link from "next/link"

interface FAQItem {
    question: string
    answer: string
    order: number
    categoryName?: string
    categoryId?: string
}

interface FAQCategory {
    _id: string
    name: string
    description: string
    faqs: FAQItem[]
}

export default function FaqTemplate() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const faqContentRef = useRef<HTMLDivElement>(null)
    
    const { data: faqResponse, isLoading } = useQuery({
        queryKey: ["faqs"],
        queryFn: () => getFaqs(),
    })

    const faqCategories: FAQCategory[] = faqResponse?.data || []

    const getCategoryId = (categoryName: string): string => {
        const nameMap: Record<string, string> = {
            "Shipping & Orders": "shipping",
            "Payment & Returns": "payment",
            "Products": "products",
            "Account": "account",
            "Storage": "storage",
            "Nutrition": "nutrition"
        }
        return nameMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
    }

    const allFAQs: FAQItem[] = faqCategories.flatMap((category: FAQCategory) => 
        category.faqs.map((faq: FAQItem) => ({
            ...faq,
            categoryName: category.name,
            categoryId: getCategoryId(category.name)
        }))
    )

    const filteredFAQs = allFAQs.filter((faq: FAQItem) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || faq.categoryId === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId)
        faqContentRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando preguntas frecuentes...</p>
                </div>
            </div>
        )
    }

    if (!faqResponse?.success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Error al cargar las preguntas</h2>
                    <p className="text-muted-foreground">Inténtalo de nuevo más tarde.</p>
                </div>
            </div>
        )
    }

    return (
        <div ref={faqContentRef} className="min-h-screen">
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Preguntas frecuentes</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        Encuentra respuestas rápidas a las dudas más comunes sobre nuestros productos, envíos y servicios.
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Buscar en las preguntas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-3 text-lg"
                        />
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-16 py-0">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Categorías</h3>
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => handleCategoryClick("all")}
                                        variant={selectedCategory === "all" ? "default" : "ghost"}
                                        className="w-full justify-start h-auto py-2 px-3"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-3" />
                                        <span className="text-sm">Todas las preguntas</span>
                                    </Button>
                                    {faqCategories.map((category) => (
                                        <Button
                                            key={category._id}
                                            onClick={() => handleCategoryClick(getCategoryId(category.name))}
                                            variant={selectedCategory === getCategoryId(category.name) ? "default" : "ghost"}
                                            className="w-full justify-start h-auto py-2 px-3"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-3" />
                                            <span className="text-sm">{category.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        {filteredFAQs.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
                                    <p className="text-muted-foreground">Prueba ajustando tu búsqueda o revisa otras categorías.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">
                                        {selectedCategory === "all"
                                            ? "Todas las preguntas"
                                            : faqCategories.find((c) => getCategoryId(c.name) === selectedCategory)?.name}
                                    </h2>
                                    <Badge variant="secondary">{filteredFAQs.length} preguntas</Badge>
                                </div>

                                <Accordion type="multiple" className="w-full">
                                    {filteredFAQs.map((faq: FAQItem, index: number) => (
                                        <AccordionItem key={`${faq.categoryName}-${index}`} value={`${faq.categoryName}-${index}`}>
                                            <AccordionTrigger className="text-left hover:no-underline cursor-pointer">
                                                <div className="flex flex-col items-start">
                                                    <h3 className="font-semibold pr-4">{faq.question}</h3>
                                                    <span className="text-xs text-muted-foreground mt-1">{faq.categoryName}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}

                        <Card className="mt-12">
                            <CardContent className="p-8 text-center">
                                <h3 className="text-xl font-bold mb-4">¿Aún tienes dudas?</h3>
                                <p className="text-muted-foreground mb-6">
                                    ¿No encuentras lo que necesitas? ¡Nuestro equipo de soporte está aquí para ayudarte!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild>
                                        <Link href="/contact">Contactar soporte</Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a href="mailto:support@nuthaven.com">Escríbenos</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
