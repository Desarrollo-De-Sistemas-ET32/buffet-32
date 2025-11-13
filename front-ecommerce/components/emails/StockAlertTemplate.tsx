import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface StockAlertTemplateProps {
    productName: string;
    productImage: string;
    productPrice: number;
    productUrl: string;
}

export function StockAlertTemplate({ productName, productImage, productPrice, productUrl }: StockAlertTemplateProps) {
    const previewText = `${productName} is back in stock!`;

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
                            Great news! {productName} is back in stock! 🎉
                        </Heading>

                        <Text style={text}>
                            Hi there,
                        </Text>

                        <Text style={text}>
                            The product you were waiting for is now available again. Don&apos;t miss out on this opportunity!
                        </Text>

                        {productImage && (
                            <Section style={imageContainer}>
                                <Img
                                    src={productImage}
                                    alt={productName}
                                    style={image}
                                />
                            </Section>
                        )}

                        <Section style={productInfo}>
                            <Text style={productNameText}>{productName}</Text>
                            <Text style={priceText}>${productPrice}</Text>
                        </Section>

                        <Section style={buttonContainer}>
                            <Link href={productUrl} style={button}>
                                View Product
                            </Link>
                        </Section>

                        <Text style={text}>
                            This is a one-time notification. If you&apos;re no longer interested in this product,
                            you can ignore this email.
                        </Text>

                        <Text style={text}>
                            Happy shopping!
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

export default StockAlertTemplate;

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

const imageContainer = {
    textAlign: 'center' as const,
    margin: '20px 0',
};

const image = {
    maxWidth: '200px',
    borderRadius: '8px',
};

const productInfo = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    textAlign: 'center' as const,
};

const productNameText = {
    color: '#1f2937',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
};

const priceText = {
    color: '#059669',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#059669',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
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