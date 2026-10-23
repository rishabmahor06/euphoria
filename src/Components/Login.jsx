import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { API } from "../api";
import { AuthField, SubmitButton } from "./AuthFields";

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = login;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    setLoading(true);
    try {
      const response = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(login),
      });

      const { success, message, jwtToken, name, role, error } = await response.json();
      if (success) {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("role", role || "user");
        handleSuccess(message);
        setTimeout(() => navigate(role === "admin" ? "/admin" : "/home"), 1000);
      } else {
        handleError(error?.details?.[0]?.message || message || "Login failed");
      }
    } catch {
      handleError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate>
      <AuthField
        label="Email address"
        type="email"
        name="email"
        value={login.email}
        onChange={handleChange}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <AuthField
        label="Password"
        type="password"
        name="password"
        value={login.password}
        onChange={handleChange}
        placeholder="Enter your password"
        autoComplete="current-password"
      />
      <div className="flex items-center justify-between -mt-1 mb-4 text-sm">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-[#1E381E]" />
          Remember me
        </label>
        <span className="text-[#1E381E] hover:underline cursor-pointer">
          Forgot password?
        </span>
      </div>
      <SubmitButton loading={loading}>{loading ? "Logging in..." : "Log In"}</SubmitButton>
    </form>
  );
};

export default Login;
