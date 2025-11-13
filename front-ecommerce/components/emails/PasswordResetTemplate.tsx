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
} from '@react-email/components';

interface PasswordResetTemplateProps {
  firstName: string;
  resetLink: string;
}

export function PasswordResetTemplate({ firstName, resetLink }: PasswordResetTemplateProps) {
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
            <Heading style={h1}>Password Reset Request</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Hello {firstName},</Heading>
            
            <Text style={text}>
              We received a request to reset your password for your Snackly account. 
              If you didn&apos;t make this request, you can safely ignore this email.
            </Text>

            <Text style={text}>
              To reset your password, click the button below. This link will expire in 1 hour for security reasons.
            </Text>

            <Section style={ctaSection}>
              <Button style={button} href={resetLink}>
                Reset Password
              </Button>
            </Section>

            <Text style={text}>
              If the button doesn&apos;t work, you can copy and paste this link into your browser:
            </Text>

            <Text style={linkText}>
              {resetLink}
            </Text>

            <Text style={text}>
              <strong>Important:</strong> This link will expire in 1 hour. If you need to reset your password again, 
              please request a new reset link from your account settings.
            </Text>

            <Text style={text}>
              If you have any questions or need assistance, don&apos;t hesitate to reach out to our support team. 
              We&apos;re here to help you!
            </Text>

            <Text style={text}>
              Best regards,<br />
              The Snackly Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to you because you requested a password reset for your Snackly account.
              If you didn&apos;t request this, please contact our support team immediately.
            </Text>
            <Text style={footerText}>
              © 2024 Snackly. All rights reserved.
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
};

const header = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0',
  padding: '0',
};

const content = {
  padding: '0 40px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const linkText = {
  color: '#3b82f6',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
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
  padding: '0 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};
