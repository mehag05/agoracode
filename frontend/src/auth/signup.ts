import { signUp } from "supertokens-web-js/recipe/emailpassword";
import { sendEmail } from "./email_verification";
import Session from "supertokens-web-js/recipe/session";

export async function signUpClicked(email: string, password: string) {
    try {
        const response = await signUp({
            formFields: [{
                id: "email",
                value: email
            }, {
                id: "password",
                value: password
            }]
        });

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if (formField.id === "email") {
                    // Email validation failed (for example incorrect email syntax),
                    // or the email is not unique.
                    window.alert(formField.error)
                } else if (formField.id === "password") {
                    // Password validation failed.
                    // Maybe it didn't match the password strength
                    window.alert(formField.error)
                }
            })
        } else if (response.status === "OK") {
            const sessionExists = await Session.doesSessionExist();
            console.log("Session exists after sign-up:", sessionExists);
            if (sessionExists) {
                try {
                    await sendEmail(); // Await the sendEmail function
                    //window.location.href = "/email-sent"; // Navigate only if sendEmail succeeds
                } catch (emailError) {
                    console.error("Error sending email:", emailError); // Log the error
                    window.alert("Failed to send email. Please try again."); // Alert the user
                }
            } else {
                console.error("Session does not exist after sign-up.");
            }

        }
        return response
    } catch (err: any) {
        console.error("Sign-up error:", JSON.stringify(err, null, 2)); // Log the entire error object
        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            window.alert(err.message);
        } else {
            //window.alert("Oops! Something went wrong.");
        }
    }
}
