import React from "react";
import wedding1 from "../assets/Collage/wedding1.webp";
import wedding2 from "../assets/Collage/wedding2.webp";
import wedding3 from "../assets/Collage/wedding3.jpg";
import wedding4 from "../assets/Collage/wedding4.jpg";
import wedding5 from "../assets/Collage/wedding5.jpg";
import wedding6 from "../assets/Collage/wedding6.webp";
import wedding7 from "../assets/Collage/wedding7.jpg";
import wedding8 from "../assets/Collage/wedding8.webp";
import wedding9 from "../assets/Collage/wedding9.jpg";
import wedding10 from "../assets/Collage/wedding10.jpg";
import wedding11 from "../assets/Collage/wedding11.jpg";
import wedding12 from "../assets/Collage/wedding12.jpg";
import wedding13 from "../assets/Collage/wedding13.jpg";
import wedding14 from "../assets/Collage/wedding14.jpg";
import wedding15 from "../assets/Collage/wedding15.jpg";
import wedding16 from "../assets/Collage/wedding16.jpg";
import wedding17 from "../assets/Collage/wedding17.jpg";
import wedding18 from "../assets/Collage/wedding18.jpg";
import wedding19 from "../assets/Collage/wedding19.jpg";
import scheduleImage from "../assets/Collage/scheduleImage.webp";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Wedding = () => {
  const images = [
    {
      id: 1,
      first: wedding1,
      second: wedding2,
      title: "The Liveforest Embroidered Chiffon Saree - Green",
      price: "50000",
    },
    {
      id: 2,
      first: wedding3,
      second: wedding4,
      title: "Seraphim Embroidered Skirt Set - Blush",
      price: "75000",
    },
    {
      id: 3,
      first: wedding5,
      second: wedding6,
      title: "Florarose Embroidered Silk Lehenga Set - Blush0",
      price: "60000",
    },
    {
      id: 4,
      first: wedding7,
      second: wedding8,
      title: "Amadahy Embroidered Silk Skirt Set - Ivory",
      price: "80000",
    },
    {
      id: 5,
      first: wedding9,
      second: wedding10,
      title: "Woodelia Embroidered Silk Lehenga Set - Natural",
      price: "90000",
    },
    {
      id: 5,
      first: wedding11,
      second: wedding12,
      title: "Woodelia Embroidered Silk Lehenga Set - Natural",
      price: "90000",
    },
    {
      id: 5,
      first: wedding13,
      second: wedding14,
      title: "Woodelia Embroidered Silk Lehenga Set - Natural",
      price: "90000",
    },
    {
      id: 5,
      first: wedding15,
      second: wedding16,
      title: "Woodelia Embroidered Silk Lehenga Set - Natural",
      price: "90000",
    },
    {
      id: 5,
      first: wedding17,
      second: wedding18,
      title: "Woodelia Embroidered Silk Lehenga Set - Natural",
      price: "90000",
    },
    {
      id: 5,
      first: wedding19,
      title: "Woodelia Embroidered Silk Lehenga Set - Natural",
      price: "90000",
    },
  ];

  return (
    <div>
      <div className="flex text-centre justify-center text-4xl pb-10 ">
        <h1>CELEBS IN EUPHORIA</h1>
      </div>
      <div>
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
              <div className="relative w-60 h-96 shadow-lg group overflow-hidden cursor-pointer group group-hover:scale-0">
                <Link to="/productdetails">
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

        <div className="flex items-center justify-center mb-5  ">
          <button className=" text-lg mt-10 mb-5 flex justify-center text-green-900 font-bold items-cente px-9 transition-all hover:text-white hover:bg-green-900 py-2 border border-green-900 ">
            SHOP NOW <FaArrowRight className=" ml-2 mt-1  text-center" />
          </button>
        </div>
      </div>

      <div>
        <div>
          <img src={scheduleImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Wedding;
