import { doesEmailExist } from "supertokens-web-js/recipe/emailpassword";

export async function checkEmail(email: string) {
    try {
        const response = await doesEmailExist({
            email
        });

        return response.doesExist;
    } catch (err: any) {
        window.alert("Oops! Something went wrong.");
        return false;
    }
}