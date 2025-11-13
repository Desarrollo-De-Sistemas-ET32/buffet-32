'use server';

import React from 'react';
import { Resend } from 'resend';

import { ContactConfirmationTemplate } from "@/components/emails/ContactConfirmationTemplate";
import ContactTemplate from '@/components/emails/ContactTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    category?: string;
    message: string;
}

export async function sendContactEmailAction(data: ContactFormData) {
    try {
        await resend.emails.send({
            from: 'Snackly <no-reply@snackly.site>',
            to: 'tomyquinteros494@gmail.com',
            subject: `New Contact Form Submission: ${data.subject}`,
            react: React.createElement(ContactTemplate, {
                name: data.name,
                email: data.email,
                subject: data.subject,
                category: data.category || '',
                message: data.message,
            }),
        });
        await resend.emails.send({
            from: 'Snackly <no-reply@snackly.site>',
            to: data.email,
            subject: 'Thank you for contacting Snackly',
            react: React.createElement(ContactConfirmationTemplate, {
                name: data.name,
                subject: data.subject,
            }),
        });

        return { success: true, message: 'Contact form submitted successfully' };
    } catch (error) {
        console.error('Error sending contact email:', error);
        return { success: false, error: 'Failed to send contact form' };
    }
} 