import React, { useContext } from "react";
import { CartContext } from "../context/Cart";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Wishlist = () => {
  const wish = useContext(CartContext);


  return (
    <div>
      <Navbar />
      <div className="px-80 py-10">
        <div className="flex justify-between text-center py-5">
          <h1 className="text-3xl">Your Curated Collection</h1>
          <p className="text-xl">Item</p>
        </div>
        <hr className="bg-gray-600 h-[.1rem]" />
        <hr />
        <div>
          {wish.length === 0 ? (
            <p>Your wishlist awaits your discerning selections</p>
          ) : (
            wish.wishlist.map((image) => (
              <div className="grid grid-cols-3" key={image.id}>
                <div className="relative w-[22rem] h-[35vw]  group overflow-hidden cursor-pointer">
                  <img
                    src={image.img}
                    className="absolute w-full inset-0 h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    alt="Craft 1"
                  />
                  <img
                    src={image.img2}
                    className="absolute inset-0  h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    alt="Craft 2"
                  />
                </div>
                <div className="text-left mt-2">
                  <h2 className="text-lg font-semibold">{image.name}</h2>
                  <p className="text-green-900 font-bold">₹ {image.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
