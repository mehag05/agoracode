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
    Hr,
    Row,
    Column,
} from '@react-email/components';
import * as React from "react";
import { format } from 'date-fns';

interface ReceiptEmailProps {
    email: string;
    date: Date;
    orderId: string;
    products: { name: string; image: string; price: number; description?: string }[];
}

export const ReceiptEmailSubject = 'agora - Your Order Confirmation!';

const ReceiptEmailHtml = (props: ReceiptEmailProps): string => {
    return render(<Email {...props} />);
};

const Email = ({ email, date, orderId, products }: ReceiptEmailProps) => {
    const total = products.reduce((acc, curr) => acc + curr.price, 0);

    console.log('Email Props:', { email, date, orderId, products }); // Debugging line

    return (
        <Html>
            <Head />
            <Preview>{ReceiptEmailSubject}</Preview>
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
                        <Text style={header}>{ReceiptEmailSubject}</Text>
                    </Section>
                    <Section style={informationTable}>
                        <Row style={informationTableRow}>
                            <Column style={informationTableColumn}>
                                <Text style={informationTableLabel}>Email</Text>
                                <Text style={informationTableValue}>{email || 'N/A'}</Text> {/* Fallback to 'N/A' */}
                            </Column>
                            <Column style={informationTableColumn}>
                                <Text style={informationTableLabel}>Order Date</Text>
                                <Text style={informationTableValue}>{date ? format(date, 'dd MMM yyyy') : 'N/A'}</Text> {/* Fallback to 'N/A' */}
                            </Column>
                            <Column style={informationTableColumn}>
                                <Text style={informationTableLabel}>Order ID</Text>
                                <Text style={informationTableValue}>{orderId ? orderId.toString() : 'N/A'}</Text> {/* Convert ObjectId to string */}
                            </Column>
                        </Row>
                    </Section>
                    <Section style={productTitleTable}>
                        <Text style={productsTitle}>Order Summary</Text>
                    </Section>
                    {products.map((product, index) => {
                        console.log('Product:', product); // Debugging line
                        return (
                            <Section key={index}>
                                <Column style={{ width: '64px' }}>
                                    <Img
                                        src={product.image}
                                        width='64'
                                        height='64'
                                        alt='Product Image'
                                        style={productIcon}
                                    />
                                </Column>
                                <Column style={{ paddingLeft: '22px' }}>
                                    <Text style={productTitle}>{product.name}</Text>
                                    {product.description && (
                                        <Text style={productDescription}>
                                            {typeof product.description === 'string' ? (
                                                product.description.length > 50
                                                    ? product.description.slice(0, 50) + '...'
                                                    : product.description
                                            ) : (
                                                'Invalid description'
                                            )}
                                        </Text>
                                    )}
                                </Column>
                                <Column style={productPriceWrapper} align='right'>
                                    <Text style={productPrice}>{formatPrice(product.price)}</Text>
                                </Column>
                            </Section>
                        );
                    })}
                    <Hr style={productPriceLine} />
                    <Section align='right'>
                        <Column style={{ width: '100%' }} align='right'>
                            <Text style={productPriceTotal}>total</Text>
                        </Column>
                        <Column style={{ width: '1px', backgroundColor: 'black' }}></Column>
                        <Column style={{ width: '100%' }}>
                            <Text style={productPriceLarge}>{formatPrice(total)}</Text>
                        </Column>
                    </Section>
                    <Hr style={productPriceLineBottom} />
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

const small = {
    fontSize: '12px',
    lineHeight: '20px',
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
  };

const heading = {
    fontSize: '28px',
    fontWeight: '600',
    color: '#4b0082',
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

const productsTitle = {
    background: '#fafafa',
    paddingLeft: '10px',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
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
const productPriceLineBottom = { margin: '0 0 75px 0' };

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

export { ReceiptEmailHtml };