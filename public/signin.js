import {
    showAlert
} from './alertMessage';
export async function signInCredentials(email, password) {
    //console.log(email, password)
    try {
        const loginResponse = await axios({
            method: "POST",
            url: "http://localhost:5000/signin",
            data: {
                email,
                password
            }
        });
        showAlert('success', "Logged in successfully")
        window.setTimeout(() => {
            window.location.href = "http://localhost:5000/";
        }, 1500)

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}