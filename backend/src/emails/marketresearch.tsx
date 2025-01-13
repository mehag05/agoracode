import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    render,
    Link,
    Img,
} from '@react-email/components';
import { CSSProperties } from 'react';

interface MarketplaceEmailProps {
    email: string;
    name: string;
}

export const MarketplaceEmailSubject = "Turn Your Stuff into Cash with Agora";

export const MarketplaceEmailHtml = (props: MarketplaceEmailProps): string => {
    return render(<MarketplaceEmail {...props} />);
};

const MarketplaceEmail = ({ email, name }: MarketplaceEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{MarketplaceEmailSubject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src="https://agorauploadimages.s3.us-west-1.amazonaws.com/Agora_logo_Gold-removebg-preview.png"
                        width='200'
                        height='100'
                        alt='Agora'
                        style={logo}
                    />
                    <Text style={paragraph}>Hi {name},</Text>
                    <Text style={paragraph}>
                        We, a group of Penn students, created Agora—a marketplace designed for Penn students by Penn students, where you can sell literally anything (not just clothes).
                    </Text>
                    <Text style={paragraph}>
                        Got textbooks you’re done with? Old furniture taking up space? Tech gadgets? Whatever it is—Agora is the easiest way to make some cash while helping other students score deals.
                    </Text>
                    <Text style={paragraph}>
                        Here’s why you should get on board:
                    </Text>
                    <Text style={paragraph}>
                        👉 It’s ridiculously easy to sign up—just your name and Penn email, and you’re in.
                    </Text>
                    <Text style={paragraph}>
                        👉 No limits on what you can sell—it’s not just about clothes! From dorm essentials to study materials, list what you have, and see what sells.
                    </Text>
                    <Text style={paragraph}>
                        👉 Support a student-run platform—we built this with you in mind, making sure it’s simple, fast, and safe for Penn students to use.
                    </Text>
                    <Section style={paragraph}>
                        <Link href="https://www.shopatagora.com" style={linkStyle}>Ready to sell? It only takes a few minutes to get started. Just head over to www.shopatagora.com and upload your first item today!</Link>
                    </Section>
                    <Text style={paragraph}>
                        If you’ve got any questions or need help with your first listing, feel free to reply to this email. We’ve got your back!
                    </Text>
                    <Text style={paragraph}>
                        Catch you on Agora,
                        Agora Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};

const logo = {
    display: 'block',
    margin: '0 auto',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    margin: '20px 0',
};

const highlight: CSSProperties = {
    textAlign: 'center' as const,
    margin: '20px 0',
};

const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
};
