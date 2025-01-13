import * as React from 'react';
import { render } from '@react-email/render';
import { Body, Button, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components';

// Define the props interface for the Forgot Password Email component
interface ForgotPasswordEmailProps {
  resetLink: string; // Link for resetting the password
}

// Email component to render the Forgot Password email's HTML content
const ForgotPasswordEmailComponent: React.FC<ForgotPasswordEmailProps> = ({ resetLink }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your agora password here!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://agorauploadimages.s3.us-west-1.amazonaws.com/Agora_logo_Gold-removebg-preview.png"
            height="105"
            alt="Logo"
            style={logo}
          />
          <Text style={paragraph}>Hi there,</Text>
          <Text style={paragraph}>
            We received a request to reset your password. Click the button below to reset it.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            <span style={signature}>The agora team</span>
          </Text>
          <Text style={footer}>
            If you did not request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// render the Forgot Password email content to HTML string
const ForgotPasswordEmail = (resetLink: string): string => {
  return render(<ForgotPasswordEmailComponent resetLink={resetLink} />);
};

// Styles for the email components
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  padding: '12px 12px',
  backgroundColor: '#4b0082', // Purple button
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

// New style for the signature
const signature = {
  color: '#f8e29c', // Gold color for the signature
  fontWeight: 'bold',
};

// Export the Forgot Password email function and a placeholder for the email subject
export { ForgotPasswordEmail, forgotPasswordEmailSubject };

// Define a placeholder email subject for the Forgot Password email
const forgotPasswordEmailSubject = 'Reset Your Password'; // Updated subject for clarity