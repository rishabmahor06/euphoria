import React, { useContext } from "react";
import { CartContext } from "../context/Cart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Navbar from "./Navbar";
import { AiOutlineHome } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaTruckMoving } from "react-icons/fa";
import { HiMiniShoppingBag } from "react-icons/hi2";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import { woomen } from "../Data/women";

const ProductDetails = (props) => {
  const cart = useContext(CartContext);

  console.log("cart", cart.wishlist);

  const { id } = useParams();

  const products = woomen.find((item) => item.id === parseInt(id));

  return (
    <>
      <Navbar />
      <div className="px-10 mt-10">
        <div className="flex justify-center shadow-lg gap-16  mb-10">
          <div>
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="productdetails"
            >
              <SwiperSlide>
                <img src={products.first} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={products.second} alt="" />
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="pl-5 pr-5">
            <div className="">
              <h1 className="text-4xl">{products.title} </h1>
              <p className="mt-5 text-gray-600 font-bold">{products.price}</p>

              <p className="mt-5 text-gray-400 font-bold">
                MRP Inclusive of all taxes
              </p>
              <p className="mt-5 ">
                The Liveforest Embroidered Chiffon Saree in vibrant green from
                Vanna Sets is pure elegance. Intricate embroidery dances across
                luxurious chiffon, creating a breathtaking, effortlessly stylish
                drape perfect for any special occasion. A modern classic.
              </p>
              <p className="mt-10 text-gray-400">Colour:</p>
              <p className="p-5 bg-green-800 w-4 h-4 rounded-3xl border-2 border-gray-400"></p>
              <p className="mt-5 text-gray-400">Size:</p>
            </div>
            <div className="flex  gap-5 mt-5">
              <h1 className="bg-transparen border-2 hover:bg-white border-gray-200 px-2 py-1 rounded-lg">
                L
              </h1>
              <h1 className="bg-transparent border-2 hover:bg-white border-gray-200 px-2 py-1 rounded-lg">
                M
              </h1>
              <h1 className="bg-transparent border-2 hover:bg-white border-gray-200 px-2 py-1 rounded-lg">
                S
              </h1>
            </div>

            <div className="mt-5 gap-3">
              <a href="#" className="text-blue-700 underline">
                View Size Guide
              </a>
              <p className="mt-11 text-gray-400">Delivery Method:</p>
              <div className=" flex justify-start mt-2 text-black gap-5">
                <p className="flex gap-2">
                  <AiOutlineHome className="mt-1" />
                  Home Delivery
                </p>
                <p className="flex gap-2 ">
                  <CiLocationOn className="mt-1 " />
                  Store Pickup
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-5 flex-col">
              <button
                className="bg-[#264726] h-14 text-white px-5 py-2 rounded-md  flex gap-2 items-center justify-center"
                onClick={() =>
                  cart.setItem([
                    ...cart.item,
                    {
                      id: products.id,
                      name: products.title,
                      price: products.price,
                      img: products.first,
                      img2: products.second,
                    },
                  ])
                }
              >
                Add to Cart
                <HiMiniShoppingBag />
              </button>
              <Link
                to="/wishlist"
                className="bg-white text-black h-14 shadow-lg px-5 py-2 rounded-md flex gap-2 items-center justify-center"
              >
                <button
                  className="bg-white text-black h-14 shadow-lg px-5 py-2 rounded-md flex gap-2 items-center justify-center"
                  onClick={() =>
                    cart.setWishlist([
                      ...cart.wishlist,
                      {
                        id: products.id,
                        name: products.title,
                        price: products.price,
                        img: products.first,
                        img2: products.second,
                      },
                    ])
                  }
                >
                  <FaHeart className="text-red-600" />
                  Add to Wishlist
                </button>
              </Link>
              <hr />
            </div>

            <div>
              <p className="mt-5 text-gray-600">
                This is a made-to-order style and will take 30 business days for
                production and dispatch orders within India and internationally.
              </p>
              <button className=" bg-transparent border border-[#264726] text-black h-14 w-full hover:bg-[#264726] hover:text-white shadow-lg px-5 py-2 flex gap-2 items-center justify-center mt-2">
                <FaTruckMoving />
                Explore Kaftans shipping in 24 hours
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
