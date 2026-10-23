import React, { useState } from "react";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "../toast";

// Outlined input with the label sitting on the border; password gets an eye toggle.
export const AuthField = ({ label, type = "text", ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="relative block mb-3">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-gray-500">
        {label}
      </span>
      <input
        {...props}
        type={isPassword && show ? "text" : type}
        className="w-full rounded-lg border-2 border-[#cfe0cf] bg-white px-4 py-2 pr-11 outline-none transition placeholder-gray-300 focus:border-[#1E381E]"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1E381E] text-lg"
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </label>
  );
};

export const SubmitButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full rounded-lg bg-[#111] py-2.5 font-medium text-white transition hover:bg-[#1E381E] active:scale-[.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {loading && (
      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
    )}
    {children}
  </button>
);

// Google / Apple need a backend OAuth setup, so for now they only show a
// notice; Email focuses the email field of the visible form.
export const SocialLogin = () => {
  const soon = (name) => () => toast.info(`${name} sign-in is not set up yet`);
  const btn =
    "flex-1 flex items-center justify-center rounded-lg border-2 border-[#cfe0cf] bg-white py-1.5 text-xl transition hover:border-[#1E381E] hover:-translate-y-0.5 active:scale-[.98]";
  return (
    <div className="flex gap-3">
      <button type="button" onClick={soon("Apple")} className={btn} aria-label="Continue with Apple">
        <FaApple />
      </button>
      <button type="button" onClick={soon("Google")} className={btn} aria-label="Continue with Google">
        <FcGoogle />
      </button>
      <button
        type="button"
        onClick={() =>
          document.querySelector('[data-auth-active] input[name="email"]')?.focus()
        }
        className={btn}
        aria-label="Continue with Email"
      >
        <FiMail />
      </button>
    </div>
  );
};
