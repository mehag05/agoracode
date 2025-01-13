import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";

export function getApiDomain() {
    const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://www.shopatagora.com' 
        : 'http://localhost:3001'; // Local development URL
    return apiUrl;
}

export function getWebsiteDomain() {
    const websiteUrl = process.env.NODE_ENV === 'production' 
        ? 'https://www.shopatagora.com' 
        : 'http://localhost:3000'; // Local development URL
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "Agora",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        Session.init(),
        EmailVerification.init(),
    ],
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};

export const PRODUCT_CATEGORIES = [
    { value: 'clothing-item', label: 'Clothing Item' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'dorm-item', label: 'Dorm Item' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'event-ticket', label: 'Event Ticket' },
    { value: 'other', label: 'Other' },
    { value: 'lease', label: 'Lease' },
  ];