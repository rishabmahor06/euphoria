import React, { useContext } from "react";
import { CartContext } from "../context/Cart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../toast";
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
import { useCatalog } from "../context/catalogContext";

const ProductDetails = () => {
  const cart = useContext(CartContext);

  const navigate = useNavigate();
  const { id } = useParams();

  const { find } = useCatalog();
  const products = find(id);

  const isClothing = products && products.group !== "jewellery";
  const soldOut = products && products.stock === 0;
  const entry = products && {
    id: products.id,
    name: products.title,
    price: products.price,
    img: products.first,
    img2: products.second,
  };
  const inWishlist = products && cart.wishlist.some((w) => w.id === products.id);

  if (!products) {
    return (
      <>
        <Navbar />
        <div className="px-10 py-20 text-center">
          <h1 className="text-2xl mb-4">Product not found</h1>
          <Link to="/women" className="text-blue-700 underline">
            Back to shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-4 md:px-10 mt-6 md:mt-10">
        <div className="flex flex-col lg:flex-row justify-center shadow-lg gap-6 lg:gap-16 mb-10">
          <div className="w-full lg:w-[40%] lg:max-w-xl shrink-0">
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
              {products.images.map((src) => (
                <SwiperSlide key={src}>
                  <img src={src} alt={products.title} className="w-full" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="pl-5 pr-5">
            <div className="">
              <h1 className="text-2xl sm:text-4xl">{products.title} </h1>
              <p className="mt-5 text-gray-600 font-bold">₹ {products.price.toLocaleString("en-IN")}</p>

              <p className="mt-5 text-gray-400 font-bold">
                MRP Inclusive of all taxes
              </p>
              <p className="mt-5 ">{products.description}</p>
            </div>
            {isClothing && (
            <>
            <p className="mt-5 text-gray-400">Size:</p>
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
            </div>
            </>
            )}

            <div className="mt-5 gap-3">
              <p className="mt-6 text-gray-400">Delivery Method:</p>
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
                disabled={soldOut}
                className="bg-[#264726] h-14 text-white px-5 py-2 rounded-md flex gap-2 items-center justify-center hover:bg-[#1E381E] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  cart.addToCart(entry);
                  toast.success("Added to cart");
                }}
              >
                {soldOut ? "Out of Stock" : "Add to Cart"}
                <HiMiniShoppingBag />
              </button>
              <button
                className="bg-white text-black h-14 shadow-lg px-5 py-2 rounded-md flex gap-2 items-center justify-center hover:bg-gray-50"
                onClick={() => {
                  if (inWishlist) {
                    navigate("/wishlist");
                  } else {
                    cart.addToWishlist(entry);
                    toast.success("Added to wishlist");
                  }
                }}
              >
                <FaHeart className="text-red-600" />
                {inWishlist ? "View Wishlist" : "Add to Wishlist"}
              </button>
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
