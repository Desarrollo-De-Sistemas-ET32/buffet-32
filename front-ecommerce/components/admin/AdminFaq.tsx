'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { toast } from 'sonner';
import { 
  Book, 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  FolderPlus, 
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getFaqs, 
  createFaqCategory, 
  addQuestionToCategory, 
  updateQuestion, 
  deleteQuestion, 
  deleteCategory 
} from '@/actions/faq';
import { FAQCategory, EditingQuestion } from './faq/types';
import CreateCategoryDialog from './faq/CreateCategoryDialog';
import AddQuestionDialog from './faq/AddQuestionDialog';
import EditQuestionDialog from './faq/EditQuestionDialog';

const AdminFaq = () => {
  const queryClient = useQueryClient();
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState<FAQCategory | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(null);

  // Fetch FAQ categories
  const { data: faqResponse, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
  });

  const faqCategories = faqResponse?.success ? faqResponse.data : [];

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      createFaqCategory(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setShowCreateCategory(false);
      toast.success('Categoría creada con éxito');
    },
    onError: () => {
      toast.error('Fallo al crear la categoría');
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: ({ categoryId, question, answer }: { categoryId: string; question: string; answer: string }) =>
      addQuestionToCategory(categoryId, question, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setShowAddQuestion(null);
      toast.success('Pregunta añadida con éxito');
    },
    onError: () => {
      toast.error('Fallo al añadir la pregunta');
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ categoryId, questionIndex, question, answer }: { categoryId: string; questionIndex: number; question: string; answer: string }) =>
      updateQuestion(categoryId, questionIndex, question, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setEditingQuestion(null);
      toast.success('Pregunta actualizada con éxito');
    },
    onError: () => {
      toast.error('Fallo al actualizar la pregunta');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: ({ categoryId, questionIndex }: { categoryId: string; questionIndex: number }) =>
      deleteQuestion(categoryId, questionIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('Pregunta eliminada con éxito');
    },
    onError: () => {
      toast.error('Fallo al eliminar la pregunta');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('Categoría eliminada con éxito');
    },
    onError: () => {
      toast.error('Fallo al eliminar la categoría');
    },
  });

  const handleDeleteQuestion = (categoryId: string, questionIndex: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      deleteQuestionMutation.mutate({ categoryId, questionIndex });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará todas las preguntas que contiene.')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-8">
        <Card className="w-full border-none shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Book className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">FAQ Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your FAQ section and display options
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <Card className="w-full border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Configuración de Preguntas Frecuentes</h2>
                <p className="text-sm text-muted-foreground">
                  Personaliza tu sección de preguntas frecuentes y opciones de visualización
                </p>
              </div>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowCreateCategory(true)}
            >
              <FolderPlus className="w-4 h-4" />
              Crear Categoría
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {faqCategories.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay Categorías de Preguntas Frecuentes</h3>
              <p className="text-muted-foreground mb-4">
                Empieza creando tu primera categoría de preguntas frecuentes
              </p>
              <Button onClick={() => setShowCreateCategory(true)}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Crear Primera Categoría
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {faqCategories.map((category: FAQCategory) => (
                <Card key={category._id} className="border">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                                              <div className="flex items-center gap-2">
                                              <Badge variant="secondary">
                                                {category.faqs.length} preguntas
                                              </Badge>
                                              <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => setShowAddQuestion(category)}
                                              >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Añadir Pregunta
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteCategory(category._id)}
                                                disabled={deleteCategoryMutation.isPending}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                          {category.faqs.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                              <p>Aún no hay preguntas en esta categoría</p>
                                            </div>
                                          ) : (                      <Accordion type="single" collapsible className="space-y-2">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`${category._id}-${index}`} className="border rounded-lg">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex items-center justify-between w-full pr-4">
                                <span className="text-left font-medium">{faq.question}</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingQuestion({
                                        category,
                                        questionIndex: index,
                                        question: faq.question,
                                        answer: faq.answer,
                                      });
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteQuestion(category._id, index);
                                    }}
                                    disabled={deleteQuestionMutation.isPending}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className="text-muted-foreground whitespace-pre-wrap">
                                {faq.answer}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Dialog Components */}
      <CreateCategoryDialog
        open={showCreateCategory}
        onOpenChange={setShowCreateCategory}
        onSubmit={createCategoryMutation.mutate}
        isLoading={createCategoryMutation.isPending}
      />

      {showAddQuestion && (
        <AddQuestionDialog
          open={!!showAddQuestion}
          onOpenChange={(open: boolean) => !open && setShowAddQuestion(null)}
          category={showAddQuestion}
          onSubmit={addQuestionMutation.mutate}
          isLoading={addQuestionMutation.isPending}
        />
      )}

      {editingQuestion && (
        <EditQuestionDialog
          open={!!editingQuestion}
          onOpenChange={(open: boolean) => !open && setEditingQuestion(null)}
          editingQuestion={editingQuestion}
          onSubmit={updateQuestionMutation.mutate}
          isLoading={updateQuestionMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminFaq;