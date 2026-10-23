import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GiNecklace } from "react-icons/gi";
import { toast } from "../toast";
import { CartContext } from "../context/Cart";

// product: { id, title, price, first|img, second|img2 }
// to: optional details link
const ProductCard = ({ product, to, badge }) => {
  const cart = useContext(CartContext);
  const first = product.first || product.img;
  const second = product.second || product.img2;

  const entry = {
    id: product.id,
    name: product.title,
    price: product.price,
    img: first,
    img2: second || first,
  };

  const image = first ? (
    <>
      <img
        src={first}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
      />
      <img
        src={second || first}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
      />
    </>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#e9dcc3] to-[#f5ecda]">
      <GiNecklace className="text-6xl text-[#1E381E]/40" />
    </div>
  );

  const frame = (
    <div className="relative w-full aspect-[3/4] group overflow-hidden rounded-xl shadow-md">
      {image}
      {badge && (
        <span className="absolute top-2 left-2 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1E381E]">
          {badge}
        </span>
      )}
      {to && (
        <span className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-[#1E381E]/90 py-2 text-center text-sm text-white transition-transform duration-300 group-hover:translate-y-0">
          View details
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col">
      {to ? <Link to={to}>{frame}</Link> : frame}
      <div className="mt-2 flex-1">
        <h2 className="text-sm sm:text-base font-semibold line-clamp-2">{product.title}</h2>
        <p className="text-green-900 font-bold">₹ {Number(product.price).toLocaleString("en-IN")}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="flex-1 bg-[#264726] text-white text-sm py-2 rounded-md hover:bg-[#1E381E] active:scale-95 transition"
          onClick={() => {
            cart.addToCart(entry);
            toast.success("Added to cart");
          }}
        >
          Add to Cart
        </button>
        <button
          className="px-3 border border-[#264726] text-[#264726] text-sm rounded-md hover:bg-[#264726] hover:text-white transition"
          onClick={() => {
            cart.addToWishlist(entry);
            toast.success("Added to wishlist");
          }}
        >
          Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
