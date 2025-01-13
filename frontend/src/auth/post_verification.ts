import { verifyEmail } from "supertokens-web-js/recipe/emailverification";

export async function consumeVerificationCode() {
    try {
        const response = await verifyEmail();
        if (response.status === "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR") {
            // can happen if the verification code is expired or invalid.
            // ask the user to retry
            window.alert("Oops! Seems like the verification link expired. Please hit okay to try again")
            window.location.assign("/auth/verify-email") // back to the email sending screen.
        } else {
            // email was verified successfully.
            window.location.assign("/verification-success");
        }
    } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
            window.alert(err.message);
        } else {
            window.alert("Oops! Something went wrong.");
        }
    }
}