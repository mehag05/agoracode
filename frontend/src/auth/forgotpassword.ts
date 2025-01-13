import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";

export async function sendEmailClicked(email: string) {
    try {
        const response = await sendPasswordResetEmail({
            formFields: [{
                id: "email",
                value: email
            }]
        });

        if (response.status === "FIELD_ERROR") {
            // one of the input formFields failed validation
            response.formFields.forEach(formField => {
                if (formField.id === "email") {
                    // Email validation failed (for example incorrect email syntax).
                    window.alert(formField.error)
                }
            })
        } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
            // can happen due to automatic account linking.
        } else {
            // reset password email sent.
            window.alert("Please check your email for the password reset link")
        }
    } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
            window.alert(err.message);
        } else {
            window.alert("Oops! Something went wrong.");
        }
    }
}