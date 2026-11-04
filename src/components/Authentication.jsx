import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Map Firebase auth error codes to short, user-friendly messages.
// Uniform "Incorrect email or password." wording avoids revealing
// whether an email exists (email enumeration).
const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "That email is already registered. Try logging in.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again in a moment.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/network-request-failed": "Couldn't reach the server. Check your connection.",
  "auth/invalid-email": "Enter a valid email address.",
};

function getAuthErrorMessage(err) {
  return AUTH_ERROR_MESSAGES[err?.code] ?? "Something went wrong. Please try again.";
}

// Client-side guard. Returns an error message, or null when valid.
function validateCredentials(email, password) {
  if (!email) return "Enter your email first.";
  if (!email.includes("@")) return "Enter a valid email address.";
  if (!password) return "Enter your password.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export default function Authentication(props) {
  const { handleCloseModal } = props;
  const [isRegistration, setIsRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  const { signup, login, resetPassword } = useAuth();

  async function handleAuthenticate() {
    const validationError = validateCredentials(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);
      if (isRegistration) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      handleCloseModal();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsAuthenticating(false);
    }
  }
  return (
    <>
      <h2 className="sign-up-text">{isRegistration ? "Sign Up" : "Login"}</h2>
      <p>
        {isRegistration ? "Create an account!" : "Sign in to your account!"}
      </p>
      {error && <p>❌ {error}</p>}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="email"
        placeholder="email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
        placeholder="********"
      />
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ? "Authenticating..." : "Submit"}</p>
      </button>
      {!isRegistration && (
        <button
          onClick={async () => {
            setError(null);
            setResetSent(false);
            if (!email) {
              setError("Enter your email first.");
              return;
            }
            if (!email.includes("@")) {
              setError("Enter a valid email address.");
              return;
            }
            try {
              await resetPassword(email);
              setResetSent(true);
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          <p>Forgot password?</p>
        </button>
      )}
      {resetSent && <p>✅ Reset link sent if the email exists.</p>}
      <hr />
      <div className="register-content">
        <p>
          {isRegistration
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
        <button
          onClick={() => {
            setIsRegistration(!isRegistration);
          }}
        >
          <p>{isRegistration ? "Sign in" : "Sign up"}</p>
        </button>
      </div>
    </>
  );
}
