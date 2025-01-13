import { signIn } from "supertokens-web-js/recipe/emailpassword";
import { UserModel } from '../schema/user'; // Adjust the path as needed

export async function signInClicked(email: string, password: string) {
    try {
        const response = await signIn({
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
                    // Email validation failed (for example incorrect email syntax).
                    window.alert(formField.error);
                }
            });
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
            window.alert("Email password combination is incorrect.");
        } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
            // the reason string is a user friendly message
            // about what went wrong. It can also contain a support code which users
            // can tell you so you know why their sign in was not allowed.
            window.alert(response.reason);
        } 
        // else {
        //     // Retrieve user data from MongoDB if needed
        //     // const user = await UserModel.findById({ email }); // change to user id
        //     if (user) {
        //         // User found, proceed with your logic
        //         window.location.href = "/";
        //     } else {
        //         window.alert("User not found.");
        //     }
        // }
        return response
    } catch (err: any) {
        console.log(err)
        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            window.alert(err.message);
        } else {
            window.alert("Oops! Something went wrong.");
        }
    }
}