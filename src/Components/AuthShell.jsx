import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiHeart } from "react-icons/fi";
import logo from "../assets/Collage/euphoria-logo.png";
import loginImage from "../assets/Collage/login.webp";
import signupImage from "../assets/Collage/signup.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";
import { SocialLogin } from "./AuthFields";

const COPY = {
  login: {
    heading: "Welcome Back",
    sub: "Log in with open account",
    image: loginImage,
    headline: "Dress the moment, celebrate in style.",
  },
  signup: {
    heading: "Join Euphoria",
    sub: "Sign up with open account",
    image: signupImage,
    headline: "Crafted for your celebrations.",
  },
};

// One card for /login and /signup. Switching the route slides the form and the
// photo past each other: login = form left / photo right, signup = the reverse.
const AuthShell = () => {
  const { pathname } = useLocation();
  const mode = pathname === "/signup" ? "signup" : "login";
  const isSignup = mode === "signup";
  const copy = COPY[mode];

  const tab =
    "flex-1 rounded-lg border py-2 text-center text-sm font-medium transition-colors duration-300 ";
  const on = "border-[#111] bg-[#111] text-white";
  const off = "border-[#111] bg-white text-[#111] hover:bg-gray-100";

  const panel = (active) =>
    "col-start-1 row-start-1 transition-all duration-500 " +
    (active
      ? "opacity-100 translate-y-0 delay-300"
      : "opacity-0 translate-y-4 pointer-events-none");

  return (
    <div>
      <Navbar />
      <div className="px-4 py-5 sm:py-8 flex justify-center bg-gradient-to-b from-[#F9EEDC] to-[#f1e3c6]">
        <div className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-2xl auth-card-in">
          {/* FORM PANEL (slides to the right on signup) */}
          <div
            className={
              "relative z-10 bg-white p-5 sm:p-7 transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)] " +
              (isSignup ? "md:translate-x-full" : "md:translate-x-0")
            }
          >
            <div className="text-center mb-3">
              <Link to="/">
                <img src={logo} alt="Euphoria" className="h-10 w-auto mx-auto" />
              </Link>
              <p className="mt-1 text-xs tracking-widest text-gray-500">
                CRAFT MORE. CELEBRATE LIFE.
              </p>
            </div>

            <div className="flex gap-3 mb-3">
              <Link to="/signup" className={tab + (isSignup ? on : off)}>
                Sign Up
              </Link>
              <Link to="/login" className={tab + (!isSignup ? on : off)}>
                Log In
              </Link>
            </div>

            <h1 key={mode} className="text-xl sm:text-2xl font-medium text-[#111] auth-fade">
              {copy.heading}
            </h1>
            <p className="mt-0.5 mb-2 text-xs text-gray-600">{copy.sub}</p>
            <SocialLogin />

            <div className="my-3 flex items-center gap-3 text-sm text-gray-700">
              <span className="h-px flex-1 bg-[#cfe0cf]" />
              or
              <span className="h-px flex-1 bg-[#cfe0cf]" />
            </div>

            {/* both forms share one grid cell, so the card height is constant */}
            <div className="grid">
              <div className={panel(!isSignup)} inert={isSignup} data-auth-active={!isSignup ? "" : undefined}>
                <Login />
              </div>
              <div className={panel(isSignup)} inert={!isSignup} data-auth-active={isSignup ? "" : undefined}>
                <Signup />
              </div>
            </div>
          </div>

          {/* PHOTO PANEL (slides to the left on signup) */}
          <div
            className={
              "hidden md:block absolute inset-y-0 left-1/2 w-1/2 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)] " +
              (isSignup ? "-translate-x-full" : "translate-x-0")
            }
          >
            {Object.entries(COPY).map(([m, c]) => (
              <img
                key={m}
                src={c.image}
                alt=""
                className={
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
                  (m === mode ? "opacity-100" : "opacity-0")
                }
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

            <div className="absolute top-5 right-5 w-52 rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur">
              <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-500 shadow">
                <FiHeart className="fill-current" />
              </span>
              <p className="font-semibold text-[#111] leading-tight">Discover, Style, Celebrate.</p>
              <p className="mt-1 text-[11px] text-gray-500">
                Handcrafted lehengas, kurtas and fine jewellery for every occasion.
              </p>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p key={mode} className="text-2xl leading-snug auth-up">{copy.headline}</p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  to="/login"
                  aria-label="Log in"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black"
                >
                  <FiArrowLeft />
                </Link>
                <Link
                  to="/signup"
                  aria-label="Sign up"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black"
                >
                  <FiArrowRight />
                </Link>
                <span className="ml-1 rounded-full bg-white/25 px-4 py-1.5 text-xs backdrop-blur">
                  Experience Euphoria
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthShell;
