import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Img,
  Hr,
  Link,
  Button,
  Row,
  Column,
} from '@react-email/components';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Wikimedia_Brand_Guidelines_Update_2022_Wikimedia_Logo_Brandmark.png"
              width="120"
              height="120"
              alt="Wikimedia Logo"
              style={logo}
            />
            <Heading style={h1}>Welcome to Our Platform!</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Hello {firstName},</Heading>
            
            <Text style={text}>
              Welcome to our amazing platform! We&apos;re thrilled to have you join our community. 
              You&apos;re now part of something special.
            </Text>

            <Text style={text}>
              Here&apos;s what you can expect from us:
            </Text>

            <Row style={featureRow}>
              <Column style={featureColumn}>
                <Text style={featureTitle}>🚀 Fast & Reliable</Text>
                <Text style={featureText}>
                  Experience lightning-fast performance with our optimized platform.
                </Text>
              </Column>
              <Column style={featureColumn}>
                <Text style={featureTitle}>🔒 Secure & Private</Text>
                <Text style={featureText}>
                  Your data is protected with enterprise-grade security measures.
                </Text>
              </Column>
            </Row>

            <Row style={featureRow}>
              <Column style={featureColumn}>
                <Text style={featureTitle}>💡 Smart Features</Text>
                <Text style={featureText}>
                  Discover powerful tools designed to enhance your experience.
                </Text>
              </Column>
              <Column style={featureColumn}>
                <Text style={featureTitle}>🎯 Personalized</Text>
                <Text style={featureText}>
                  Get recommendations tailored specifically to your preferences.
                </Text>
              </Column>
            </Row>

            <Section style={ctaSection}>
              <Button style={button} href="https://snackly.site/products">
                Get Started
              </Button>
            </Section>

            <Text style={text}>
              If you have any questions or need assistance, don&apos;t hesitate to reach out to our support team. 
              We&apos;re here to help you succeed!
            </Text>

            <Text style={text}>
              Best regards,<br />
              The Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © 2024 Your Company. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href="https://snackly.site/privacy" style={footerLink}>
                Privacy Policy
              </Link>{' '}
              |{' '}
              <Link href="https://snackly.site/terms" style={footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 0',
  backgroundColor: '#f8fafc',
  borderRadius: '8px 8px 0 0',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '0',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '0',
};

const content = {
  padding: '40px 40px 20px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const featureRow = {
  margin: '32px 0',
};

const featureColumn = {
  padding: '0 16px',
  width: '50%',
};

const featureTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const featureText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px 40px',
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 8px 8px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const footerLink = {
  color: '#3b82f6',
  textDecoration: 'underline',
};