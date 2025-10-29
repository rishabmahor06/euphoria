import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import logiImage from "../assets/Collage/login.webp";
import { FaRegEnvelope } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import signupImage from "../assets/Collage/signup.png";
import { handleError, handleSuccess } from "../utils";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignup = { ...signup };
    copySignup[name] = value;
    setSignup(copySignup);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signup;
    if (!name || !email || !password) {
      return handleError("name, email, and password are required");
    }

    try {
      const url = "http://localhost:5000/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(signup),
      });

      const result = await response.json();
      const { success, message, error} = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login')
        }, 1000);
      } else if(error){
        const details = error?.details[0].message;
        handleError(details);
      }else if(!success){
        handleError(message);
      }
        
      console.log(result);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className=" flex pt-20 pb-40 min-h-screen justify-center  ">
        <div className="  flex justify-center shadow-lg bg-[#F3F4F6] rounded-xl">
          <div className="w-96">
            <img
              src={signupImage}
              alt=""
              className="w-full h-full rounded-l-xl object-cover"
            />
          </div>
          <div className="flex flex-col p-10">
            <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
            <p className="mb-5 text-gray-500">
              Sign up for free to access any of our products
            </p>

            <form onSubmit={handleSignup}>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <div className="mb-4 flex items-center border bg-white border-gray-300 rounded-md px-3   focus-within:ring-1 focus-within:ring-gray-500">
                <FaRegUser className="text-gray-400 w-5 h-5 mr-2" />

                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={signup.name}
                  placeholder="Name"
                  className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-0"
                />
              </div>

              <label className="block text-gray-700 font-medium mb-1">
                Email address
              </label>

              <div className="mb-4 flex items-center border bg-white border-gray-300 rounded-md px-3   focus-within:ring-1 focus-within:ring-gray-500">
                <FaRegEnvelope className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={signup.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-0"
                />
              </div>

              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="mb-4 flex items-center border bg-white border-gray-300 rounded-md px-3   focus-within:ring-1 focus-within:ring-gray-500">
                <CiLock className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  onChange={handleChange}
                  value={signup.password}
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full  rounded-md px-3 py-2 focus:outline-none focus:ring-0"
                />
              </div>
              <button
                type="submit"
                className=" w-full bg-[#1F771F] rounded-md h-10 text-white"
              >
                Log In
              </button>
            </form>
            <p className=" flex justify-center mt-3 text-gray-600">
              Already have an account?
              <Link to="/login" className="hover:underline text-blue-600 ml-2">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
