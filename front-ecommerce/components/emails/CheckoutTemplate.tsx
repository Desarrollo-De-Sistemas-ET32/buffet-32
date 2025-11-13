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
  Row,
  Column,
  Button,
  Hr
} from "@react-email/components";
import { Product } from '../../types/product';

interface CheckoutTemplateProps {
  products: Array<Product & { quantity: number }>;
  paymentId: string;
  checkoutLink: string;
}

export function CheckoutTemplate({ products, paymentId, checkoutLink }: CheckoutTemplateProps) {
  const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Wikimedia_Brand_Guidelines_Update_2022_Wikimedia_Logo_Brandmark.png"
              width="80"
              height="80"
              alt="Company Logo"
              style={logo}
            />
            <Heading style={h1}>Order Confirmation</Heading>
            <Text style={subtitle}>Thank you for your purchase!</Text>
          </Section>

          {/* Order Details */}
          <Section style={content}>
            <Row style={orderInfoRow}>
              <Column style={orderInfoColumn}>
                <Text style={orderInfoLabel}>Payment ID</Text>
                <Text style={orderInfoValue}>#{paymentId}</Text>
              </Column>
              <Column style={orderInfoColumn}>
                <Text style={orderInfoLabel}>Date</Text>
                <Text style={orderInfoValue}>{new Date().toLocaleDateString()}</Text>
              </Column>
            </Row>

            {/* Products Table */}
            <Section style={productsSection}>
              <Heading style={h2}>Order Summary</Heading>

              {products.map((product) => (
                <Row key={product._id} style={productRow}>
                  <Column style={productImageColumn}>
                    <Img
                      src={product.images[0]}
                      alt={product.name}
                      width="80"
                      height="80"
                      style={productImage}
                    />
                  </Column>
                  <Column style={productDetailsColumn}>
                    <Text style={productName}>{product.name}</Text>
                    <Text style={productDescription}>
                      {product.description?.substring(0, 60)}...
                    </Text>
                  </Column>
                  <Column style={productQuantityColumn}>
                    <Text style={productQuantity}>Qty: {product.quantity}</Text>
                  </Column>
                  <Column style={productPriceColumn}>
                    <Text style={productPrice}>${(product.price * product.quantity).toFixed(2)}</Text>
                  </Column>
                </Row>
              ))}

              <Hr style={divider} />

              {/* Total */}
              <Row style={totalRow}>
                <Column style={totalLabelColumn}>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column style={totalValueColumn}>
                  <Text style={totalValue}>${total.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Button style={ctaButton} href={checkoutLink}>
                View Order Details
              </Button>
            </Section>

            {/* Footer Message */}
            <Section style={footerSection}>
              <Text style={footerText}>
                We&apos;ll send you a shipping confirmation email once your order ships.
                If you have any questions, please don&apos;t hesitate to contact our support team.
              </Text>

              <Text style={footerText}>
                Thank you for choosing us!<br />
                Best regards,<br />
                The Team
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={footerDivider} />
          <Section style={footer}>
            <Text style={footerCopyright}>
              © 2024 Your Company. All rights reserved.
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
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 40px 20px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px 12px 0 0',
};

const logo = {
  margin: '0 auto 16px',
  display: 'block',
  borderRadius: '8px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '16px 0 8px',
  padding: '0',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '8px 0',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  padding: '0',
};

const content = {
  padding: '0 40px 40px',
};

const orderInfoRow = {
  margin: '0 0 32px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
};

const orderInfoColumn = {
  width: '50%',
  textAlign: 'center' as const,
};

const orderInfoLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const orderInfoValue = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const productsSection = {
  margin: '32px 0',
};

const productRow = {
  margin: '0 0 20px',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const productImageColumn = {
  width: '80px',
  paddingRight: '16px',
};

const productImage = {
  borderRadius: '6px',
  objectFit: 'cover' as const,
};

const productDetailsColumn = {
  paddingRight: '16px',
};

const productName = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const productDescription = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
  lineHeight: '20px',
};

const productQuantityColumn = {
  width: '60px',
  textAlign: 'center' as const,
};

const productQuantity = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const productPriceColumn = {
  width: '80px',
  textAlign: 'right' as const,
};

const productPrice = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const totalRow = {
  margin: '24px 0',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
};

const totalLabelColumn = {
  textAlign: 'left' as const,
};

const totalLabel = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const totalValueColumn = {
  textAlign: 'right' as const,
};

const totalValue = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const ctaButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
};

const footerSection = {
  margin: '40px 0',
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px',
};

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '24px 40px',
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 12px 12px',
};

const footerCopyright = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
}; 