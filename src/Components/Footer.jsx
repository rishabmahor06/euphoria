import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import {
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { BsEnvelope } from "react-icons/bs";
import { BsTelephone } from "react-icons/bs";

const Footer = () => {
  return (
    <div>
      <div className="footer flex  justify-center items-center p-5 text-white bg-[#1E381E] gap-20">
        <h2 className="text-2xl font-bold">Enter Into The World of Euphoria</h2>
        <div className="flex  justify-center items-center border-b-2 text-white bg-[#1E381E] gap-5">
          <input
            type="text"
            placeholder="Enter Your Email Here"
            className="bg-transparent w-[25vw] border-gray-300 focus:border-gray-400 outline-none placeholder-gray-100 py-2"
          />
          <FaArrowRight className="mt-2   text-center text-xl " />
        </div>
      </div>

      <div className="flex justify-around text-[#1E381E] leading-loose bg-[#F9F0E1] p-10 gap-5 md:flex-wrap sm:flex-wrap  ">
        <div>
          <h3 className="font-bold">Customer Care</h3>
          <p className="hover:underline cursor-pointer">
            Orders & Shipment Balance
          </p>
          <p className="hover:underline cursor-pointer">Returns & Exchange</p>
          <p className="hover:underline cursor-pointer">Contact Us FAQs</p>
          <p className="hover:underline cursor-pointer">Check Gift Card</p>
        </div>
        <div>
          <h3 className="font-bold">About Us</h3>
          <p className="hover:underline cursor-pointer">Euphoria Foundation</p>
          <p className="hover:underline cursor-pointer">Sustainability</p>
          <p className="hover:underline cursor-pointer">Careers</p>
        </div>
        <div>
          <h3 className="font-bold">Categories</h3>
          <p className="hover:underline cursor-pointer">Women</p>
          <p className="hover:underline cursor-pointer">Men</p>
          <p className="hover:underline cursor-pointer">Wedding</p>
        </div>
        <div>
          <h3 className="font-bold">Legal</h3>
          <p className="hover:underline cursor-pointer">
            Corporate Information
          </p>
          <p className="hover:underline cursor-pointer">Terms & Conditions</p>
          <p className="hover:underline cursor-pointer">Privacy Policy</p>
          <p className="hover:underline cursor-pointer">Shipping Policy</p>
        </div>
        <div>
          <h3 className="font-bold">Need Help?</h3>
          <p className="flex items-center hover:underline cursor-pointer">
            <CiLocationOn className="mr-1" />
            Store Locator
          </p>
          <p className="flex items-center hover:underline cursor-pointer">
            <BsEnvelope className="mr-1" />
            Email Us
          </p>
          <p className="flex items-center hover:underline cursor-pointer">
            <BsTelephone className="mr-1" />
            WhatsApp / Call Us: +91 98015 16770
          </p>
        </div>
      </div>
      <div className="flex justify-between bg-white pr-20 pl-20">
        <h3 className="flex items-center text-[#1E381E]">
          © 2025 House of Euphoria Private Limited. | All Rights Reserved.
        </h3>
        <div className="flex gap-5 justify-center text-xl p-5 text-[#1E381E]">
          <p>
            <FaTwitter />
          </p>
          <p>
            <FaFacebookF />
          </p>
          <p>
            <FaYoutube />
          </p>
          <p>
            <FaInstagram />
          </p>
          <p>
            <FaPinterest />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
