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

interface ContactConfirmationTemplateProps {
  name: string;
  subject: string;
}

export const ContactConfirmationTemplate: React.FC<ContactConfirmationTemplateProps> = ({
  name,
  subject,
}) => {
  const previewText = `Thank you for contacting Snackly - We'll get back to you soon!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Snackly</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>
              Thank you for contacting us! 🎉
            </Heading>
            
            <Text style={text}>
              Hi {name},
            </Text>
            
            <Text style={text}>
              We&apos;ve received your message regarding &quot;{subject}&quot; and we&apos;re excited to help you!
            </Text>
            
            <Text style={text}>
              Our team will review your inquiry and get back to you within 24 hours during business days.
            </Text>
            
            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>What happens next?</strong>
              </Text>
              <Text style={infoText}>
                • We&apos;ll review your message and assign it to the appropriate team member
              </Text>
              <Text style={infoText}>
                • You&apos;ll receive a detailed response within 24 hours
              </Text>
              <Text style={infoText}>
                • If you need immediate assistance, feel free to call us at +1 (555) 123-NUTS
              </Text>
            </Section>
            
            <Text style={text}>
              In the meantime, you can:
            </Text>
            
            <Text style={text}>
              • Check out our <a href="https://snackly.site/faq" style={link}>FAQ page</a> for quick answers
            </Text>
            <Text style={text}>
              • Browse our <a href="https://snackly.site/products" style={link}>product catalog</a>
            </Text>
            <Text style={text}>
              • Follow us on social media for updates and special offers
            </Text>
            
            <Text style={text}>
              Thank you for choosing Snackly!
            </Text>
            
            <Text style={text}>
              Best regards,
              <br />
              The Snackly Team
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

export default ContactConfirmationTemplate;

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

const infoText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px 0',
};

const link = {
  color: '#059669',
  textDecoration: 'underline',
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