import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { API } from "../api";
import { AuthField, SubmitButton } from "./AuthFields";

const Signup = () => {
  const [signup, setSignup] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignup((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signup;
    if (!name || !email || !password) {
      return handleError("Name, email and password are required");
    }

    setLoading(true);
    try {
      const response = await fetch(API + "/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signup),
      });

      const { success, message, error } = await response.json();
      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(error?.details?.[0]?.message || message || "Sign up failed");
      }
    } catch {
      handleError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} noValidate>
      <AuthField
        label="Name"
        name="name"
        value={signup.name}
        onChange={handleChange}
        placeholder="Your full name"
        autoComplete="name"
      />
      <AuthField
        label="Email address"
        type="email"
        name="email"
        value={signup.email}
        onChange={handleChange}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <AuthField
        label="Password"
        type="password"
        name="password"
        value={signup.password}
        onChange={handleChange}
        placeholder="Create a password"
        autoComplete="new-password"
      />
      <SubmitButton loading={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </SubmitButton>
    </form>
  );
};

export default Signup;
