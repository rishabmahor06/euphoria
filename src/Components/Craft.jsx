import React from "react";
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
import { images } from "../Data/craft";
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

  return (
    <div>
      <div className="flex justify-center items-center ">
        <video
          className="craftvideo "
          autoPlay
          loop
          muted
          // src={craftvideo}
          src="https://res.cloudinary.com/dvucqewfn/video/upload/v1741138982/video_mob_subkyg.mp4"
        ></video>
      </div>

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
            "@0.00": {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            "@0.75": {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            "@1.00": {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            "@1.50": {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          modules={[FreeMode, Autoplay, Pagination]}
          className="craft swiperr overflow-hidden"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id} className="">
              <div className="relative w-60 h-80 shadow-lg group overflow-hidden cursor-pointer">
                <Link to={`/productdetails/${img.title.replace(/\s+/g, "-")}/${img.id}`}>
                  <img
                    src={img.first}
                    className="absolute inset-0 h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    alt="Craft 1"
                  />
                  <img
                    src={img.second}
                    className="absolute inset-0  h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    alt="Craft 2"
                  />
                </Link>
              </div>
              <div className="text-left mt-2">
                <h2 className="text-lg font-semibold">{img.title}</h2>
                <p className="text-green-900 font-bold">₹ {img.price}</p>
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
        <div className="flex justify-center my-10 mx-auto px-4 pt-5 mb-20">
          <img src={readyship} alt="" />
        </div>
        <div className="flex justify-center text-4xl text-[#264726] mb-10">
          <h1>IN THE SPOTLIGHT</h1>
        </div>
      </div>
      <div className="flex ml-10 mr-10 mb-20 ">
        {spotlight.map((spotlight) => (
          <div key={spotlight.id} className=" m-2 ">
            <Link to="/productdetails">
              <div className="relative text-center  overflow-hidden group group-hover:scale-0 ">
                <img
                  src={spotlight.first}
                  alt=""
                  className="w-96 object-cover transform transition duration-500 group-hover:scale-110"
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
        <div className="flex pb-10 gap-10  ">
          <div className="ml-44 w-full h-full">
            <img src={thought} alt="" className=" object-cover " />
          </div>
          <div className=" mr-44 w-full">
            <h1 className="mt-44 pb-5 text-3xl">THOUGHTFULLY CRAFTED GIFTS</h1>
            <p className="text-lg text-gray-600">
              Rooted in Rajasthan & meticulously handcrafted by master artisans,
              these modern-day keepsakes make the perfect gifts.
            </p>
            <button className="bg-transparent border border-[#264726] text-[#264726] font-bold h-12 w-44 hover:bg-[#264726] hover:text-white  flex gap-2 items-center justify-center ml-44 mt-10">
              Shop Now <FaArrowRight className=" ml-2 mt-1  text-center" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Craft;
