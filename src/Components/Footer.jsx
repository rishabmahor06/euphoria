import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "../toast";
import { api } from "../api";
import logo from "../assets/Collage/euphoria-logo.png";
import { FaArrowRight } from "react-icons/fa6";
import {
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { BsEnvelope, BsTelephone } from "react-icons/bs";

const socials = [
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaFacebookF, label: "Facebook" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaYoutube, label: "YouTube" },
  { icon: FaPinterest, label: "Pinterest" },
];

// `to` links to a real page; items without it are plain text for now.
const columns = [
  {
    title: "Shop",
    items: [
      { label: "All Products", to: "/shop" },
      { label: "Women", to: "/women" },
      { label: "Jewellery", to: "/necklase" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    title: "Customer Care",
    items: [
      { label: "Orders & Shipment" },
      { label: "Returns & Exchange" },
      { label: "Contact Us / FAQs" },
      { label: "Check Gift Card" },
    ],
  },
  {
    title: "About Us",
    items: [
      { label: "Our Story", to: "/about" },
      { label: "Euphoria Foundation" },
      { label: "Sustainability" },
      { label: "Careers" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Corporate Information" },
      { label: "Terms & Conditions" },
      { label: "Privacy Policy" },
      { label: "Shipping Policy" },
    ],
  },
];

const linkClass = "text-[#1E381E]/80 hover:text-[#1E381E] hover:underline";

const Footer = () => {
  const [email, setEmail] = useState("");

  const subscribe = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await api("/api/newsletter", { method: "POST", body: { email: email.trim() } });
      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <footer>
      <div className="bg-[#1E381E] text-white px-4 sm:px-8 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10 text-center md:text-left">
        <h2 className="text-xl sm:text-2xl font-bold">
          Enter Into The World of Euphoria
        </h2>
        <form
          onSubmit={subscribe}
          className="flex w-full md:w-auto md:min-w-[26rem] items-center border-b-2 border-white/80"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email Here"
            className="flex-1 min-w-0 bg-transparent outline-none placeholder-gray-300 py-2"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="p-2 text-xl hover:translate-x-1 transition-transform"
          >
            <FaArrowRight />
          </button>
        </form>
      </div>

      <div className="bg-[#F9F0E1] text-[#1E381E] px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-10">
          <div className="col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/">
              <img src={logo} alt="Euphoria" className="h-20 w-auto" />
            </Link>
            <p className="mt-3 text-sm text-[#1E381E]/80 max-w-xs">
              Handcrafted lehengas, kurtas and fine jewellery for every
              celebration.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[#1E381E]/30 hover:bg-[#1E381E] hover:text-white transition-colors"
                >
                  {React.createElement(s.icon)}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold mb-3">{col.title}</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {col.items.map((it) => (
                  <li key={it.label}>
                    {it.to ? (
                      <Link to={it.to} className={linkClass}>
                        {it.label}
                      </Link>
                    ) : (
                      <span className={linkClass + " cursor-pointer"}>
                        {it.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#1E381E]/15 flex flex-col md:flex-row gap-3 md:gap-8 text-sm text-[#1E381E]/90 items-start md:items-center">
          <span className="font-bold">Need Help?</span>
          <span className="flex items-center gap-2 cursor-pointer hover:underline">
            <CiLocationOn className="text-lg shrink-0" />
            Store Locator
          </span>
          <span className="flex items-center gap-2 cursor-pointer hover:underline">
            <BsEnvelope className="shrink-0" />
            Email Us
          </span>
          <a
            href="tel:+919801516770"
            className="flex items-center gap-2 hover:underline"
          >
            <BsTelephone className="shrink-0" />
            WhatsApp / Call Us: +91 98015 16770
          </a>
        </div>
      </div>

      <div className="bg-white px-4 sm:px-8 lg:px-16 py-4 text-center text-sm text-[#1E381E]">
        © 2025 House of Euphoria Private Limited. | All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
