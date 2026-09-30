import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
    if (!email || !email.includes("@") || !password || password.length < 6) {
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
      console.log(err.message);
      setError(err.message);
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
            if (!email || !email.includes("@")) {
              setError("Enter your email first.");
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
