'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

import { FAQCategory, EditingQuestion } from './types';

interface EditQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingQuestion: EditingQuestion;
  onSubmit: (data: { categoryId: string; questionIndex: number; question: string; answer: string }) => void;
  isLoading: boolean;
}

export default function EditQuestionDialog({
  open,
  onOpenChange,
  editingQuestion,
  onSubmit,
  isLoading
}: EditQuestionDialogProps) {
  const [formData, setFormData] = useState({ question: '', answer: '' });

  // Update form data when editingQuestion changes
  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        question: editingQuestion.question,
        answer: editingQuestion.answer,
      });
    }
  }, [editingQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }
    onSubmit({
      categoryId: editingQuestion.category._id,
      questionIndex: editingQuestion.questionIndex,
      question: formData.question,
      answer: formData.answer,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pregunta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editQuestion">Pregunta</Label>
            <Input
              id="editQuestion"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Introduce la pregunta"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editAnswer">Respuesta</Label>
            <Textarea
              id="editAnswer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Introduce la respuesta"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Pregunta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 