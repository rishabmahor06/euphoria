import React from "react";
import { useCatalog } from "../context/catalogContext";
import scheduleImage from "../assets/Collage/scheduleImage.webp";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Wedding = () => {
  const { women: woomen } = useCatalog();
  const images = woomen.slice(8, 16);

  return (
    <div>
      <div className="flex text-center justify-center text-2xl sm:text-4xl pb-10 px-4 ">
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
              <div className="relative w-full aspect-[5/8] shadow-lg group overflow-hidden cursor-pointer group group-hover:scale-0">
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

        <div className="flex items-center justify-center mb-5  ">
          <button className=" text-lg mt-10 mb-5 flex justify-center text-green-900 font-bold items-cente px-9 transition-all hover:text-white hover:bg-green-900 py-2 border border-green-900 ">
            SHOP NOW <FaArrowRight className=" ml-2 mt-1  text-center" />
          </button>
        </div>
      </div>

      <div>
        <div>
          <img src={scheduleImage} alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Wedding;
