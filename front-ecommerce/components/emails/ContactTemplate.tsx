import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactTemplateProps {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export const ContactTemplate: React.FC<ContactTemplateProps> = ({
  name,
  email,
  subject,
  category,
  message,
}) => {
  const previewText = `New contact form submission from ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Snackly - New Contact Form Submission</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>
              New Contact Form Submission 📧
            </Heading>
            
            <Section style={infoBox}>
              <Text style={infoLabel}>From:</Text>
              <Text style={infoValue}>{name} ({email})</Text>
              
              <Text style={infoLabel}>Subject:</Text>
              <Text style={infoValue}>{subject}</Text>
              
              <Text style={infoLabel}>Category:</Text>
              <Text style={infoValue}>{category || 'Not specified'}</Text>
            </Section>
            
            <Section style={messageBox}>
              <Text style={messageLabel}>Message:</Text>
              <Text style={messageText}>{message}</Text>
            </Section>
            
            <Text style={text}>
              Please respond to this inquiry within 24 hours.
            </Text>
            
            <Text style={text}>
              You can reply directly to: {email}
            </Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 Snackly. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactTemplate;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
  borderBottom: '1px solid #e6ebf1',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '40px 20px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const infoBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #e5e7eb',
};

const infoLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
};

const infoValue = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0 0 16px 0',
  fontWeight: '500',
};

const messageBox = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '2px solid #e5e7eb',
};

const messageLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
};

const messageText = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
  borderTop: '1px solid #e6ebf1',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}; 