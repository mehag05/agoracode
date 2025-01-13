import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { PreBuiltUIList, SuperTokensConfig, ComponentWrapper } from "./config/config";
import { FetchUser } from "./utils/fetchUser"; // Import the custom hook
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import ProductsPage from "./pages/ProductsPage";
import React, { Suspense, lazy } from "react";
import axios from "./axiosConfig";
import Spinner from "components/Spinner";

SuperTokens.init(SuperTokensConfig);

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const SignInPage = lazy(() => import("./pages/signinpage"));
const SignUpPage = lazy(() => import("./pages/signuppage"));
const UserProfile = lazy(() => import("./components/Settings"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const EmailSentPage = lazy(() => import("./pages/EmailSent"));
const HowitWorksPage = lazy(() => import("./pages/HowitWorksPage"));
const EditProduct = lazy(() => import("./components/EditProduct"));
const PasswordResetPage = lazy(() => import("./pages/PasswordResetPage"));
const VerifyEmailSuccessPage = lazy(() => import("./pages/VerifyEmailSuccessPage"));
const BetaModeScreen = lazy(() => import("./pages/BetaPage"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

function App() {
    const { user, loading, error } = FetchUser();

    if (loading) {
        return <div><Spinner /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <SuperTokensWrapper>
            <Router>
                <Navbar />
                <div className="fill">
                    <Suspense fallback={<div><Spinner /></div>}>
                        <Routes>
                            {/* This shows the login UI on "/auth" route */}
                            {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"), PreBuiltUIList)}

                            <Route path="/" element={<Home />} />
                            <Route path="/auth/signin" element={<SignInPage />} />
                            <Route path="/auth/signup" element={<SignUpPage />} />
                            <Route path="/reset-password" element={<PasswordResetPage />} />
                            <Route path="/sell" element={<SellerDashboard />} />
                            <Route path="/edit-product/:id" element={<EditProduct />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/howitworks" element={<HowitWorksPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/orders" element={<MyOrders />} />
                            <Route path="/settings" element={<UserProfile user={user} />} />
                            <Route path="/products" element={<ProductsPage searchParams={{ type: "all", category: "all", sort: "newest" }} />} />
                            <Route path="/success" element={<ThankYouPage />} />
                            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                            <Route path="/email-sent" element={<EmailSentPage />} />
                            <Route path="/verification-success" element={<VerifyEmailSuccessPage />} />
                            <Route path="/beta" element={<BetaModeScreen />} />
                            <Route path="/terms-conditions" element={<TermsConditions />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        </Routes>
                    </Suspense>
                </div>
            </Router>
        </SuperTokensWrapper>
    );
}

export default App;