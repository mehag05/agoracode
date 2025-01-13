import { sendVerificationEmail } from "supertokens-web-js/recipe/emailverification";

// TODO: uncomment window alerts

export async function sendEmail() {
    try {
        console.log("Sending verification email");
        const response = await sendVerificationEmail();
        if (response.status === "EMAIL_ALREADY_VERIFIED_ERROR") {
            // Redirect the user to the home page
            window.location.assign("/");
        } else {
            // email was sent successfully.
            window.alert("Please check your email and click the link in it");
        }
    } catch (err: any) {
        console.error("Error sending verification email:", err);

        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API
            window.alert(`Error: ${err.message}`);
        } else if (err instanceof Response) {
            // Handle fetch Response error
            const errorText = await err.text();
            console.error("Server response:", errorText);
            //window.alert(`Server error (${err.status}): ${err.statusText}`);
        } else {
            // provide better logging for this case
            console.error("Error sending verification email:", err);
            //window.alert("Oops! Something went wrong.");
        }
    }
}