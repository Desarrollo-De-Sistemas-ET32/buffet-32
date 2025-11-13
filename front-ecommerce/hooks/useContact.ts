'use client';

import { useMutation } from '@tanstack/react-query';
import { sendContactEmailAction, ContactFormData } from '../actions/contact';
import { toast } from 'sonner';

export const useContactForm = () => {
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const result = await sendContactEmailAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to send contact form');
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    },
    onError: (error: Error) => {
      console.error('Contact form error:', error.message);
      toast.error('Failed to send message. Please try again.');
    },
  });
}; 