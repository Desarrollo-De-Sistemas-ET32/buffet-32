import { EmailTemplate } from '../../../components/emails/EmailTemplate';
import { CheckoutTemplate } from '../../../components/emails/CheckoutTemplate';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, react } = body;

    let reactElement: React.ReactElement;
    if (react && react.component === 'CheckoutTemplate') {
      reactElement = React.createElement(CheckoutTemplate, react.props);
    } else if (react && react.component === 'EmailTemplate') {
      reactElement = React.createElement(EmailTemplate, react.props);
    } else if (React.isValidElement(react)) {
      reactElement = react;
    } else {
      reactElement = EmailTemplate({ firstName: "John" });
    }

    const { data, error } = await resend.emails.send({
      from: 'Nuts Ecommerce <no-reply@snackly.site>',
      to: [to],
      subject: subject || "Hello world",
      react: reactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}