import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    render,
} from '@react-email/components';

import * as React from "react";
import { IUser } from "../models/user";
import { IProduct } from "../models/Product";

interface SellerProductSoldEmailProps {
    seller: IUser;
    product: IProduct;
    buyer: IUser;
}

// Remove duplicate declaration if imported from another file
export const YourProductOrderedEmailSubject = 'agora - your product has been sold!';

const YourProductOrderedEmailHtml = (seller: IUser, product: IProduct, buyer: IUser): string => {
    return render(<SellerProductSoldEmail seller={seller} product={product} buyer={buyer} />);
}

export const SellerProductSoldEmail = ({ seller, product, buyer }: SellerProductSoldEmailProps) => {
    const deliveryTips = 
    `Please deliver the product to ${buyer.deliveryLocation} within the next 3 days to receive your funds. 
    Feel free to use Agora packaging materials which you can find available for pickup on our instagram. 
    If not, you can use your own packaging materials. 
    Make sure to label your package with your buyer's name: ${buyer.firstName} ${buyer.lastName}.
    Once you deliver your item, navigate to the seller dashboard and mark the item as delivered to receive your payment!`;
    return (
        <Html>
            <Head />
            <Preview>
                Your product has been sold!
            </Preview>
            <Body style={main}>
                <Container style={container}>
                <img
                    src="https://agorauploadimages.s3.us-west-1.amazonaws.com/Agora_logo_Gold-removebg-preview.png" // Update with your logo URL
                    width="200"
                    height="110"
                    alt="Logo"
                    />
                    <Text style={header}>Congratulations, {seller.firstName}!</Text>
                    <Text style={paragraph}>
                        Your product <strong>{product.name}</strong> has been sold!
                    </Text>
                    <h2 style={deliveryTipsHeader}>Delivery tips!</h2>
                    <Text style={paragraph}>{deliveryTips}</Text> {/* Populate section with delivery tips */}
                    <Text style={paragraph}>
                        Thank you for being a seller on agora!
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
};

const header = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    marginBottom: '10px',
};

const deliveryTipsHeader = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '20px',
};

export { YourProductOrderedEmailHtml };