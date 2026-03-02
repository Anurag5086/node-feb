import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
    const handleSuccess = (credentialResponse) => {
        console.log("Google login successful:", credentialResponse);
        // Send the credential to the backend for verification and authentication
        axios.post(`http://localhost:3000/api/auth/google-login`, { token: credentialResponse.credential })
            .then(response => {
                console.log("Backend response after Google login:", response.data);
                alert("Google login successful!");
                // Store the token in localStorage and redirect to home page
                localStorage.setItem("token", response.data.token);
                window.location.href = "/"; // Redirect to home page after successful login
            })
            .catch(error => {
                console.error("There was an error during Google login!", error);
                alert("Google login failed. Please try again.");
            });
    };

    const handleError = () => {
        console.error("Google login failed");
        alert("Google login failed. Please try again.");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
};

export default GoogleLoginButton;