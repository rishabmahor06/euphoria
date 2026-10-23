import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { CartContext } from "../context/Cart";
import { useCatalog } from "../context/catalogContext";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Wishlist = () => {
  const cart = useContext(CartContext);
  const { find } = useCatalog();
  const list = cart.wishlist;

  return (
    <div>
      <Navbar />
      <div className="px-4 md:px-12 xl:px-24 py-8 md:py-14 min-h-[70vh]">
        <div className="flex items-end justify-between pb-4 border-b border-[#1E381E]/20">
          <h1 className="text-2xl sm:text-4xl text-[#1E381E]">
            Your Curated Collection
          </h1>
          <p className="text-gray-600">
            {list.length} {list.length === 1 ? "item" : "items"}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="py-16 text-center">
            <CiHeart className="mx-auto text-7xl text-[#1E381E]/30" />
            <h2 className="mt-3 text-2xl text-[#1E381E]">
              Your wishlist awaits your discerning selections
            </h2>
            <p className="mt-2 text-gray-600">
              Tap the heart on any piece to save it here.
            </p>
            <Link
              to="/shop"
              className="inline-block mt-6 px-8 py-3 bg-[#264726] text-white font-bold rounded-md hover:bg-[#1E381E]"
            >
              EXPLORE THE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
            {list.map((p) => {
              const link = find(p.id) ? `/productdetails/${p.name.replace(/\s+/g, "-")}/${p.id}` : null;
              const image = (
                <div className="relative w-full aspect-[3/4] group overflow-hidden rounded-xl shadow-md">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <img
                    src={p.img2 || p.img}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  />
                </div>
              );
              return (
                <div key={p.id} className="relative flex flex-col">
                  <button
                    onClick={() => cart.removeFromWishlist(p.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove from wishlist"
                  >
                    <IoClose className="text-xl" />
                  </button>
                  {link ? <Link to={link}>{image}</Link> : image}
                  <div className="mt-2 flex-1">
                    <h2 className="text-sm sm:text-base font-semibold line-clamp-2">
                      {p.name}
                    </h2>
                    <p className="text-green-900 font-bold">
                      ₹ {p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    onClick={() => cart.moveToCart(p.id)}
                    className="mt-2 w-full bg-[#264726] text-white text-sm py-2 rounded-md hover:bg-[#1E381E] active:scale-95 transition"
                  >
                    Move to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
