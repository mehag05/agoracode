import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    render,
    Img,
} from '@react-email/components';
import * as React from "react";

interface SoftLaunchEmailProps {
    recipientName: string;
}

export const SoftLaunchEmailSubject = '🥳🥳SOFT LAUNCH🥳🥳 AGORA IS HERE!';

const SoftLaunchEmailHtml = (): string => {
    return render(<Email />);
};

const Email = () => {
    return (
        <Html>
            <Head />
            <Preview>{SoftLaunchEmailSubject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Img
                            src="https://agorauploadimages.s3.us-west-1.amazonaws.com/Agora_logo_Gold-removebg-preview.png"
                            width='200'
                            height='105'
                            alt='Agora'
                            style={logo}
                        />
                    </Section>
                    <Section>
                        <Text style={header}>🥳🥳AGORA IS HERE🥳🥳</Text>
                    </Section>
                    <Section>
                        <Text style={paragraph}>
                            Hey there,
                        </Text>
                        <Text style={paragraph}>
                            We know you’ve been waiting… the wait is OVER!!
                        </Text>
                        <Text style={paragraph}>
                            Your campus marketplace: agora 💛💜 is soft launching to all of our interested sellers RIGHT NOW!! Be one of the first 100 listed products to enter our ongoing $100 AMAZON GIFT CARD GIVEAWAY!! Winners announced next week!
                        </Text>
                        <Section style={buttonContainer}>
                            <a href="https://www.shopatagora.com" style={button}>Visit Agora</a>
                        </Section>
                    </Section>
                    <Section>
                        <Text style={small}>
                            If you have any questions or need further assistance, please contact us at agoraupenn@gmail.com.
                        </Text>
                    </Section>
                    <Text style={footerCopyright}>
                        Copyright © 2024 Agora Marketplace LLC. <br />
                        <a href='#'>All rights reserved</a>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#f9f9f9',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '660px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const logo = {
    margin: '0 auto',
};

const header = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    marginBottom: '10px',
};

const link = {
    color: '#4b0082',
    textDecoration: 'none',
};

const small = {
    fontSize: '12px',
    lineHeight: '20px',
};

const footerCopyright = {
    margin: '25px 0 0 0',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: 'rgb(102,102,102)',
};

const buttonContainer = {
    textAlign: 'center' as const,
    marginTop: '20px',
};

const button = {
    display: 'inline-block',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#4b0082',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
};

export { SoftLaunchEmailHtml };