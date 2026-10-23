import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageHeader from "./PageHeader";
import logo from "../assets/Collage/euphoria-logo.png";

const values = [
  {
    title: "Craftsmanship",
    text: "Every piece is embroidered and finished by skilled artisans, with attention to the smallest detail.",
  },
  {
    title: "Timeless Design",
    text: "Modern silhouettes rooted in Indian tradition, made to be worn and treasured for years.",
  },
  {
    title: "Sustainability",
    text: "Thoughtful materials and made-to-order production keep waste low and quality high.",
  },
];

const stats = [
  { n: "500+", l: "Artisans" },
  { n: "10k+", l: "Happy customers" },
  { n: "24h", l: "Ready-to-ship" },
  { n: "100%", l: "Secure checkout" },
];

const About = () => (
  <div>
    <Navbar />
    <PageHeader
      title="About Euphoria"
      subtitle="Indian occasion wear that celebrates craft, colour and confidence."
    />

    <section className="px-4 sm:px-8 lg:px-16 py-10 sm:py-16 grid md:grid-cols-2 gap-8 items-center">
      <div className="flex justify-center">
        <img src={logo} alt="Euphoria" className="w-56 sm:w-80" />
      </div>
      <div className="text-gray-700 leading-relaxed space-y-4 text-base sm:text-lg">
        <h2 className="text-2xl sm:text-3xl text-[#1E381E]">Our Story</h2>
        <p>
          House of Euphoria began with a simple idea: festive and bridal wear
          should feel as special to wear as it is to look at. From sarees and
          lehengas to kurta sets and co-ords, each collection is designed
          around hand embroidery and rich fabrics.
        </p>
        <p>
          We work closely with artisans across India, blending traditional
          techniques with contemporary cuts, so every outfit tells a story.
        </p>
      </div>
    </section>

    <section className="bg-[#F9F0E1] px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
      <h2 className="text-2xl sm:text-3xl text-center text-[#1E381E] mb-8">
        What We Stand For
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
        {values.map((v) => (
          <div
            key={v.title}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-[#264726] mb-2">
              {v.title}
            </h3>
            <p className="text-gray-600">{v.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="px-4 sm:px-8 lg:px-16 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((s) => (
        <div key={s.l}>
          <p className="text-3xl sm:text-4xl font-bold text-[#264726]">{s.n}</p>
          <p className="text-gray-600">{s.l}</p>
        </div>
      ))}
    </section>

    <div className="text-center pb-14">
      <Link
        to="/shop"
        className="inline-block px-9 py-2 text-lg border border-green-900 text-green-900 font-bold transition-all hover:text-white hover:bg-green-900"
      >
        EXPLORE THE COLLECTION
      </Link>
    </div>
    <Footer />
  </div>
);

export default About;
