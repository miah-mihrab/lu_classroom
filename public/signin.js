import { showAlert } from "./alertMessage";
export async function signInCredentials(email, password) {
  console.log(email, password);
  try {
    const loginResponse = await axios({
      method: "POST",
      url: "/signin",
      data: {
        email,
        password
      }
    });
    console.log(loginResponse);
    showAlert("success", "Logged in successfully");
    window.setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}
