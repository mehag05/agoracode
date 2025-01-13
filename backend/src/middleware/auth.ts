import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { UserModel } from '../models/user';
import { ForgotPasswordEmail, forgotPasswordEmailSubject } from '../emails/ForgotPasswordEmail';
import { SMTPService } from "supertokens-node/recipe/emailpassword/emaildelivery";
import { SMTPService as EmailVerificationSMTPService } from "supertokens-node/recipe/emailverification/emaildelivery";
import EmailVerification from "supertokens-node/recipe/emailverification";
import { EmailHtml, EmailSubject } from '../emails/VerifyEmail';
import { smtpSettings } from '../config/stmp';

export function getApiDomain() { 
    const apiUrl = process.env.NODE_ENV === 'production' 
        ? "https://www.shopatagora.com" 
        : "http://localhost:3001"; // Local development URL
    return apiUrl;
}

export function getWebsiteDomain() {
    const websiteUrl = process.env.NODE_ENV === 'production' 
        ? "https://www.shopatagora.com" 
        : "http://localhost:3000"; // Local development URL
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://st-prod-786f4240-68c8-11ef-be6b-53c797cb75dc.aws.supertokens.io",
        apiKey: process.env.SUPERTOKENS_API_KEY
    },
    appInfo: {
        appName: "Agora supertokens",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        // apiBasePath: "/auth",
        // websiteBasePath: "/auth"
    },
    // Add this new configuration
    isInServerlessEnv: true,
    framework: "express",
    recipeList: [
        EmailPassword.init({
            emailDelivery: {
                service: new SMTPService({
                    smtpSettings: smtpSettings,
                    override: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            getContent: async function (input) {
                                const { user, passwordResetLink } = input;
                            
                                // Extract the token and userId from the original passwordResetLink
                                const url = new URL(passwordResetLink);
                                const token = url.searchParams.get("token");
                                const userId = url.searchParams.get("userId");
                            
                                // Construct custom URL
                                const customResetLink = `${getWebsiteDomain()}/reset-password?token=${token}&userId=${userId}`;
                            
                                const originalContent = await originalImplementation.getContent(input);
                                originalContent.body = ForgotPasswordEmail(customResetLink);
                                originalContent.subject = forgotPasswordEmailSubject;
                            
                                return originalContent;
                            }
                        }
                    }
                })
            },
            signUpFeature: {
                formFields: [
                    {
                        id: "email",
                        validate: async (value) => {
                            return undefined;
                        },
                    },
                    {
                        id: "password",
                        validate: async (value) => {
                            return undefined;
                        },
                    },
                ],
            },
            override: {
                apis: (o) => {
                    return {
                        ...o,
                        signInPOST: async (input) => {
                            if (o.signInPOST === undefined) {
                                return {
                                    status: "WRONG_CREDENTIALS_ERROR",
                                };
                            }
                            const response = await o.signInPOST(input);
                            if (response.status === "OK") {
                                return response;
                            }
                            return {
                                status: "WRONG_CREDENTIALS_ERROR",
                            };
                        },
                        signUpPOST: async (input) => {
                            console.log("Received sign-up input:", input);

                            if (o.signUpPOST === undefined) {
                                return {
                                    status: "GENERAL_ERROR",
                                    message: "Sign up not available",
                                };
                            }
                            const response = await o.signUpPOST(input);
                            if (response.status === "OK") {
                                const formFields = input.formFields;
                                console.log("Form Fields:", formFields);
                                try {
                                    const { emails } = response.user;
                                    const newUser = new UserModel({
                                        supertokens_id: response.user.id,
                                        email: emails[0],
                                        firstName: '', 
                                        lastName: '',
                                        deliveryLocation: '',
                                        role: 'buyer',
                                        password: '', // should be handled by SuperTokens
                                        verified: false
                                    });
    
                                    await newUser.save();
                                    console.log('New user saved:', newUser);
                                    return response; // Return the original response which includes user and session
                                    } catch (error) {
                                        console.error('Error saving new user:', error);
                                    }
                            }
                            return response;
                        },
                        passwordResetPOST: async function(input) {
                            
                            if (o.passwordResetPOST === undefined) {
                                throw Error("Should never come here");
                            }

                            // First we call the original implementation
                            const response = await o.passwordResetPOST(input);
                            
                            // Then we check if it was successfully completed
                            if (response.status === "OK") {
                                // TODO: post password reset logic
                            }
                            return response;
                        }
                    }
                }
            },
        }),
        EmailVerification.init({
            mode: "REQUIRED",
            emailDelivery: {
                service: new EmailVerificationSMTPService({
                    smtpSettings: smtpSettings,
                    override: (originalImplementation: any) => {
                        return {
                            ...originalImplementation,
                            getContent: async (input: any) => {
                                try {
                                    console.log('email verif input: ', input);
    
                                    // Ensure `input` contains the expected fields
                                    const { emailVerifyLink, user } = input;
    
                                    // Debug logs (these are good for tracking the flow)
                                    console.log('email is:', user.email);
                                    console.log('email link:', emailVerifyLink);
    
                                    // Get original content
                                    const og = await originalImplementation.getContent(input);
    
                                    // Customize email content
                                    og.body = EmailHtml(emailVerifyLink); // Ensure `EmailHtml` is a valid function returning a string
                                    og.subject = EmailSubject; // Ensure `EmailSubject` is a valid string
    
                                    // Return the modified content
                                    return og;
                                } catch (error) {
                                    console.error("Error generating email content:", error);
                                    throw new Error("Failed to generate email content."); // Handle or rethrow the error
                                }
                            },
                        };
                    }
                })
            }
        }),
        Session.init(), 
        Dashboard.init({
            admins: [
                "mehagaba@gmail.com",
              ],
        }), 
        UserRoles.init()],
};
