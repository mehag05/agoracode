import { submitNewPassword } from "supertokens-web-js/recipe/emailpassword";

export async function newPasswordEntered(newPassword: string) {
    try {
        const response = await submitNewPassword({
            formFields: [{
                id: "password",
                value: newPassword
            }]
        });

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if (formField.id === "password") {
                    // New password did not meet password criteria on the backend.
                    window.alert(formField.error)
                }
            })
        } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
            // the password reset token in the URL is invalid, expired, or already consumed
            window.alert("Password reset failed. Please try again")
            window.location.assign("auth/signin") // back to the login screen.
        } else {
            window.alert("Password reset successful!")
            window.location.assign("auth/signin")
        }
    } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            window.alert(err.message);
        } else {
            window.alert("Oops! Something went wrong.");
        }
    }
}