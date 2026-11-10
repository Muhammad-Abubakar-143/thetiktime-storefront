import { z } from 'zod';

const CONTACT_EMAIL = 'thetiktime0@gmail.com';
const CONTACT_SUBJECTS = [
  'General Enquiry',
  'Product Question',
  'Order Support',
  'Watch Sourcing',
  'Other',
] as const;

const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(200).optional().default(''),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Please submit a valid message.' }, { status: 400 });
  }

  const submission = contactSubmissionSchema.safeParse(body);
  if (!submission.success) {
    return Response.json(
      { message: 'Please check the form and try again.' },
      { status: 400 }
    );
  }

  if (submission.data.website) {
    return Response.json({ message: 'Message received.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const validFrom = from && z.string().email().safeParse(from).success;
  if (!apiKey || !validFrom) {
    console.error('Contact email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.');
    return Response.json(
      {
        message:
          'Email sending is not configured correctly. Set RESEND_FROM_EMAIL to a valid address on a domain verified with Resend.',
      },
      { status: 503 }
    );
  }

  const { name, email, phone, subject, message } = submission.data;
  const text = [
    'New contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Contact form: ${subject}`,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend rejected contact email:', response.status, error);
      return Response.json(
        { message: 'We could not send your message. Please try again later.' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Contact email delivery failed:', error);
    return Response.json(
      { message: 'We could not send your message. Please try again later.' },
      { status: 502 }
    );
  }

  return Response.json({ message: 'Your message has been sent.' });
}
