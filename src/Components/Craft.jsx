import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import readyship from "../assets/Collage/readyship.webp";
import spotlight1 from "../assets/Collage/spotlight1.webp";
import spotlight2 from "../assets/Collage/spotlight2.webp";
import spotlight3 from "../assets/Collage/spotlight3.webp";
import spotlight4 from "../assets/Collage/spotlight4.webp";
import thought from "../assets/Collage/thought.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useCatalog } from "../context/catalogContext";
const Craft = () => {
  
  const spotlight = [
    {
      id: 1,
      first: spotlight1,
      title: "READY TO SHIP",
    },
    {
      id: 2,
      first: spotlight2,
      title: "MODERN HEIRLOOMS",
    },
    {
      id: 3,
      first: spotlight3,
      title: "TIMELESS REDS",
    },
    {
      id: 4,
      first: spotlight4,
      title: "VEGAN ACCESSORIES",
    },
  ];

  const { women, bannersFor } = useCatalog();
  const images = women.slice(0, 8);
  const promo = bannersFor("promo")[0] || readyship;
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div>
      {!videoFailed && (
        <div className="flex justify-center items-center ">
          <video
            className="craftvideo "
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoFailed(true)}
            src="https://res.cloudinary.com/dvucqewfn/video/upload/v1741138982/video_mob_subkyg.mp4"
          ></video>
        </div>
      )}

      <div className="flex justify-center my-10 mx-auto px-4 pt-5 ">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          modules={[FreeMode, Autoplay, Pagination]}
          className="craft swiperr overflow-hidden"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id} className="">
              <div className="relative w-full aspect-[3/4] shadow-lg group overflow-hidden cursor-pointer">
                <Link to={`/productdetails/${img.title.replace(/\s+/g, "-")}/${img.id}`}>
                  <img
                    src={img.first}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    alt="Craft 1"
                  />
                  <img
                    src={img.second}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    alt="Craft 2"
                  />
                </Link>
              </div>
              <div className="text-left mt-2">
                <h2 className="text-lg font-semibold">{img.title}</h2>
                <p className="text-green-900 font-bold">₹ {img.price.toLocaleString("en-IN")}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex items-center justify-center mb-5  ">
        <button className=" text-lg mt-0 flex justify-center text-green-900 font-bold items-cente px-9 transition-all hover:text-white hover:bg-green-900 py-2 border border-green-900 ">
          SHOP NOW <FaArrowRight className=" ml-2 mt-1  text-center" />
        </button>
      </div>

      <div>
        <div className="flex justify-center my-10 mx-auto px-4 pt-5 mb-10">
          <img src={promo} alt="" className="w-full" />
        </div>
        <div className="flex justify-center text-2xl sm:text-4xl text-[#264726] mb-10 px-4">
          <h1>IN THE SPOTLIGHT</h1>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mx-4 sm:mx-10 mb-20">
        {spotlight.map((spotlight) => (
          <div key={spotlight.id} className="m-1 sm:m-2">
            <Link to="/women">
              <div className="relative text-center  overflow-hidden group group-hover:scale-0 ">
                <img
                  src={spotlight.first}
                  alt=""
                  className="w-full object-cover transform transition duration-500 group-hover:scale-110"
                />
                <div className="absolute  inset-0 bg-black bg-opacity-50 flex items-center justify-center  transition duration-500 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-lg font-semibold">
                    Shop Now
                  </span>
                </div>
              </div>{" "}
            </Link>
            <p className="mt-2 mb-2 text-lg text-center">{spotlight.title}</p>
          </div>
        ))}
      </div>

      <div className="w-full h-full mb-10">
        <div className="flex flex-col md:flex-row items-center pb-10 gap-6 md:gap-10 px-4 sm:px-10 lg:px-0">
          <div className="w-full md:w-1/2 lg:pl-44">
            <img src={thought} alt="" className="w-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left lg:pr-44">
            <h1 className="md:mt-0 pb-5 text-2xl sm:text-3xl">
              THOUGHTFULLY CRAFTED GIFTS
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Rooted in Rajasthan & meticulously handcrafted by master artisans,
              these modern-day keepsakes make the perfect gifts.
            </p>
            <Link
              to="/shop"
              className="bg-transparent border border-[#264726] text-[#264726] font-bold h-12 w-44 hover:bg-[#264726] hover:text-white flex gap-2 items-center justify-center mx-auto md:mx-0 mt-8"
            >
              Shop Now <FaArrowRight className="ml-2 text-center" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Craft;
