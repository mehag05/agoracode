import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    render,
  } from '@react-email/components'
  
  import * as React from "react"
  
  interface EmailTemplateProps {
    emailVerifyLink: string
  }
  const EmailSubject = 'Agora - Verify Your Email!'

  const EmailHtml = (content: string): string => {
    return render (<Email emailVerifyLink={content} /> )
  }
  export const Email = ({
    emailVerifyLink
  }: EmailTemplateProps) => {
    return (
      <Html>
        <Head />
        <Preview>
          Buy and Sell on campus!
        </Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src="https://agorauploadimages.s3.us-west-1.amazonaws.com/Agora_logo_Gold-removebg-preview.png"
              width="200"
              height="105"
              alt="Logo"
              style={logo}
            />
            <Text style={paragraph}>Hi there,</Text>
            <Text style={paragraph}>
                Welcome to agora! Use the button below
                to verify your Penn email.
            </Text>
            <Section style={btnContainer}>
              <Button style={button} href={emailVerifyLink}>
                Verify email
              </Button>
            </Section>
            <Text style={paragraph}>
              Best,
              <br />
              The agora team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              If you did not request this email, you can
              safely ignore it.
            </Text>
          </Container>
        </Body>
      </Html>
    )
  }
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  }
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
  }
  
  const logo = {
    margin: '0 auto',
  }
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
  }
  
  const btnContainer = {
    textAlign: 'center' as const,
  }
  
  const button = {
    padding: '12px 12px',
    backgroundColor: '#4b0082',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
  }
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  }
  
  const footer = {
    color: '#8898aa',
    fontSize: '12px',
  }
  
  export {EmailHtml, EmailSubject}