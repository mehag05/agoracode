import * as React from 'react';
import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  render,
} from '@react-email/components';
import { format } from 'date-fns';

interface DeliveryNotificationEmailProps {
  email: string;
  date: Date;
  orderId: string;
  products: { name: string; image: string; price: number; description?: string }[];
  deliveryLocation: string;
}

export const DeliveryNotificationEmailSubject = "Your order has been delivered!"

export const DeliveryNotificationEmailHtml = (props: DeliveryNotificationEmailProps) =>
    render(<DeliveryNotificationEmail {...props} />, {
      pretty: true,
    });

export const DeliveryNotificationEmail = ({
  email,
  date,
  orderId,
  products,
  deliveryLocation
}: DeliveryNotificationEmailProps) => {
  const total = products.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <Html>
      <Head />
      <Preview>Your order has been delivered</Preview>

      <Body style={main}>
        <Container style={container}>
          <Text style={header}>Order delivered</Text>
          <img
                    src="https://agorauploadimages.s3.us-west-1.amazonaws.com/Agora_logo_Gold-removebg-preview.png" // Update with your logo URL
                    width="200"
                    height="105"
                    alt="Logo"
                    />
          <Text style={paragraph}>
            Hey, {products[0].name} has been delivered to {deliveryLocation}. Thanks for shopping on Agora!
          </Text>
          <Text style={paragraph}>Email: {email || 'N/A'}</Text>
          <Text style={paragraph}>Delivery date: {format(date, 'dd MMM yyyy')}</Text>
          <Text style={paragraph}>Order id: {orderId ? orderId.toString() : 'N/A'}</Text>
          <Text style={productsTitle}>Order summary</Text>
          {products.map((product, index) => (
            <Text key={index} style={productParagraph}>
              {product.name || 'Unknown Product'} - {formatPrice(product.price)}
            </Text>
          ))}
          <Text style={totalText}>Total: {formatPrice(total)}</Text>
          <Text style={small}>
            If you have any questions or need further assistance, please contact us at agoraupenn@gmail.com.
          </Text>
          <Text style={footerCopyright}>
            Copyright © 2024 Agora Inc. <br />
            <Link href='#'>All rights reserved</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f9f9f9', // Light background color
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const small = {
  fontSize: '12px',
  lineHeight: '20px',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '660px',
  backgroundColor: '#ffffff', // White background for the container
  borderRadius: '8px', // Rounded corners for the container
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
};

const tableCell = { display: 'table-cell' };

const heading = {
  fontSize: '28px',
  fontWeight: '300',
  color: '#4b0082', // Dark purple color for heading
};

const informationTable = {
  borderCollapse: 'collapse' as const,
  borderSpacing: '0px',
  color: 'rgb(51,51,51)',
  backgroundColor: 'rgb(250,250,250)',
  borderRadius: '3px',
  fontSize: '12px',
  marginTop: '12px',
};

const informationTableRow = {
  height: '46px',
};

const informationTableColumn = {
  paddingLeft: '20px',
  borderStyle: 'solid',
  borderColor: 'white',
  borderWidth: '0px 1px 1px 0px',
  height: '44px',
};

const informationTableLabel = {
  color: 'rgb(102,102,102)',
  fontSize: '10px',
};

const informationTableValue = {
  fontSize: '12px',
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
};

const productTitleTable = {
  margin: '30px 0 15px 0',
  height: '24px',
};

const productIcon = {
  margin: '0 0 0 20px',
  borderRadius: '14px',
  border: '1px solid rgba(128,128,128,0.2)',
};

const productTitle = {
  fontSize: '12px',
  fontWeight: '600',
};

const productDescription = {
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const productPriceTotal = {
  margin: '0',
  color: 'rgb(102,102,102)',
  fontSize: '10px',
  fontWeight: '600',
  padding: '0px 30px 0px 0px',
  textAlign: 'right' as const,
};

const productPrice = {
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
};

const productPriceLarge = {
  margin: '0px 20px 0px 0px',
  fontSize: '16px',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  textAlign: 'right' as const,
};

const productPriceWrapper = {
  display: 'table-cell',
  padding: '0px 20px 0px 0px',
  width: '100px',
  verticalAlign: 'top',
};

const productPriceLine = { margin: '30px 0 0 0' };

const productPriceVerticalLine = {
  height: '48px',
  borderLeft: '1px solid',
  borderColor: 'rgb(238,238,238)',
};

const productPriceLargeWrapper = {
  display: 'table-cell',
  width: '90px',
};

const productPriceLineBottom = { margin: '0 0 75px 0' };

const footerLinksWrapper = {
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const footerCopyright = {
  margin: '25px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};
// Utility function to format price
const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
};

const header = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
};

const productsTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '20px',
};

const productParagraph = {
  fontSize: '14px',
};

const totalText = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginTop: '10px',
};