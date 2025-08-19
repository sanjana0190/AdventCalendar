import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { LOGIN_USER } from "../graphql/queries/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string, isSignUp: boolean) => void;
}

const AuthModal = ({ isOpen, onClose, onSubmit }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lazy query - only executes when called
  const [loginUser] = useLazyQuery(LOGIN_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      // Directly handle sign-up since it's not a query
      onSubmit(email, password, isSignUp);
    } else {
      try {
        const { data } = await loginUser({ variables: { email, password } });

        // Check if the query returns any matching user accounts
        if (data?.users?.length > 0) {
          // Store the user ID in sessionStorage
          const userId = data.users[0].id; // Assuming the ID field is named 'id'
          sessionStorage.setItem("userId", userId);

          // Call onSubmit with the successful login
          onSubmit(email, password, isSignUp);
        } else {
          setErrorMessage("Invalid email or password.");
        }
      } catch (err) {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  const modalTitle = isSignUp ? "Sign Up" : "Login";
  // Removed modalDescription per user request

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
        <h2 className="font-header text-2xl mb-4 text-center text-[#E73B0D]">
          {modalTitle}
        </h2>
        {/* description removed */}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4 font-body"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2 font-body"
          />

          <a
            className="font-body text-xs text-[#E73B0D] hover:text-[#B32B00] block text-right mb-4"
            href="#"
          >
            Forgot password?
          </a>

          {errorMessage && (
            <div className="text-red-500 mb-2 font-body text-sm text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="font-button bg-[#E73B0D] text-white px-4 py-2 rounded hover:bg-[#B32B00] transition-colors"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm font-body mt-4">
          {isSignUp ? "Already have an account? " : "Need an account? "}
          <button
            type="button"
            className="text-[#E73B0D] underline hover:text-[#B32B00]"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
