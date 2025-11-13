'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

import { FAQCategory } from './types';

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: FAQCategory;
  onSubmit: (data: { categoryId: string; question: string; answer: string }) => void;
  isLoading: boolean;
}

export default function AddQuestionDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading
}: AddQuestionDialogProps) {
  const [formData, setFormData] = useState({ question: '', answer: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }
    onSubmit({
      categoryId: category._id,
      question: formData.question,
      answer: formData.answer,
    });
    setFormData({ question: '', answer: '' });
  };

  const handleCancel = () => {
    setFormData({ question: '', answer: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Pregunta a {category.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pregunta</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Introduce la pregunta"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Respuesta</Label>
            <Textarea
              id="answer"
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
              {isLoading ? 'Añadiendo...' : 'Añadir Pregunta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 