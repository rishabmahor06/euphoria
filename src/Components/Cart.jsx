import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdChevronLeft, MdOutlineSecurity } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { GoGift } from "react-icons/go";
import { TfiMedall } from "react-icons/tfi";
import { HiMiniShoppingBag } from "react-icons/hi2";
import confetti from "canvas-confetti";
import { CartContext } from "../context/Cart";
import { useCatalog } from "../context/catalogContext";
import { getToken } from "../api";
import { toast } from "../toast";
import Checkout from "./Checkout";
import Navbar from "./Navbar";
import Footer from "./Footer";

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

const partyPopper = () => {
  const colors = ["#264726", "#f5c542", "#e63946", "#ffffff", "#ff8fab"];
  const shot = (originX, angle) =>
    confetti({
      particleCount: 90,
      angle,
      spread: 70,
      startVelocity: 55,
      origin: { x: originX, y: 0.75 },
      colors,
      zIndex: 9999,
    });
  shot(0, 60);
  shot(1, 120);
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.4 },
      colors,
      zIndex: 9999,
    });
  }, 250);
};

const Cart = () => {
  const cart = useContext(CartContext);
  const { find } = useCatalog();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [checkout, setCheckout] = useState(false);
  const navigate = useNavigate();

  const proceed = () => {
    if (!getToken()) {
      toast.warning("Please log in to continue to payment");
      return navigate("/login");
    }
    setCheckout(true);
  };

  const { item, subTotal } = cart;
  const discount = applied ? subTotal * 0.2 : 0;
  const total = subTotal - discount;

  const handleApply = () => {
    if (code.trim().toLowerCase() === "royal15") {
      if (!applied) partyPopper();
      setApplied(true);
      setCodeError("");
    } else {
      setApplied(false);
      setCodeError("Invalid code");
    }
  };

  const removeCode = () => {
    setApplied(false);
    setCode("");
  };

  return (
    <div>
      <Navbar />
      <div className="w-full px-4 md:px-12 xl:px-24 py-8 md:py-14 bg-[#F8F1E7] min-h-[70vh]">
        <h1 className="text-[#1E381E] font-bold mb-6 text-3xl md:text-4xl">
          Shopping Cart
        </h1>

        {item.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm py-16 px-4 text-center">
            <HiMiniShoppingBag className="mx-auto text-6xl text-[#1E381E]/30" />
            <h2 className="mt-4 text-2xl text-[#1E381E]">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              to="/shop"
              className="inline-block mt-6 px-8 py-3 bg-[#264726] text-white font-bold rounded-md hover:bg-[#1E381E]"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <div className="bg-white rounded-xl shadow-sm w-full lg:flex-1">
              <div className="px-5 py-5 flex justify-between items-center border-b">
                <h3 className="text-[#1E381E] text-xl sm:text-2xl">
                  Your Selections
                </h3>
                <p className="bg-[#EDEFED] px-4 py-1 rounded-2xl text-sm">
                  {cart.cartCount} {cart.cartCount === 1 ? "item" : "items"}
                </p>
              </div>

              {item.map((p) => {
                const link = find(p.id) ? `/productdetails/${p.name.replace(/\s+/g, "-")}/${p.id}` : null;
                const image = (
                  <div className="relative w-full sm:w-36 h-56 sm:h-48 shrink-0 group overflow-hidden rounded-xl shadow-[6px_6px_0px_#E4E8E6]">
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
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row gap-5 p-5 border-b last:border-b-0"
                  >
                    {link ? <Link to={link}>{image}</Link> : image}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        {link ? (
                          <Link to={link} className="font-bold text-lg hover:underline">
                            {p.name}
                          </Link>
                        ) : (
                          <p className="font-bold text-lg">{p.name}</p>
                        )}
                        <p className="text-xl font-semibold whitespace-nowrap">
                          {fmt(p.price * p.qty)}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {fmt(p.price)} each
                      </p>

                      <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            className="w-9 h-9 text-xl hover:bg-gray-100 disabled:opacity-40"
                            onClick={() => cart.updateQty(p.id, p.qty - 1)}
                            disabled={p.qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-10 text-center">{p.qty}</span>
                          <button
                            className="w-9 h-9 text-xl hover:bg-gray-100 disabled:opacity-40"
                            onClick={() => cart.updateQty(p.id, p.qty + 1)}
                            disabled={p.qty >= 10}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-100 text-[#264726] text-sm hover:bg-green-200"
                            onClick={() => cart.moveToWishlist(p.id)}
                          >
                            <CiHeart className="text-lg" />
                            Move to Wishlist
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-600 text-sm hover:bg-red-200"
                            onClick={() => cart.removeFromCart(p.id)}
                          >
                            <RiDeleteBinLine />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap gap-2 justify-between px-5 py-5 border-t">
                <Link
                  to="/shop"
                  className="flex items-center gap-1 text-[#264726] hover:underline"
                >
                  <MdChevronLeft />
                  Continue Shopping
                </Link>
                <p className="text-gray-600">Free shipping on all orders</p>
              </div>
            </div>

            <div className="w-full lg:w-96 shrink-0 rounded-xl bg-white shadow-sm lg:sticky lg:top-4">
              <h1 className="flex items-center gap-3 px-5 py-5 text-[#264726] font-bold text-2xl border-b">
                <LuCrown />
                Order Summary
              </h1>
              <div className="px-5 py-5 space-y-3">
                <div className="flex justify-between">
                  <h3>Merchandise Subtotal</h3>
                  <p>{fmt(subTotal)}</p>
                </div>
                {applied && (
                  <div className="flex justify-between text-green-700">
                    <h3>Royal Discount (20%)</h3>
                    <p>- {fmt(discount)}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <h3 className="flex items-center gap-1">
                    Premium Delivery
                    <TfiMedall className="w-4 h-4 p-[2px] bg-[#EDEFED] rounded-xl" />
                  </h3>
                  <p className="text-[#264726]">Complimentary</p>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold">Order Total</h1>
                  <p className="text-2xl font-bold">{fmt(total)}</p>
                </div>
                <hr />

                <div>
                  <p className="text-[#264726] mb-2 mt-2">Exclusive Code</p>
                  {applied ? (
                    <div className="bg-green-50 border border-green-200 rounded-md px-3 py-3 text-green-800">
                      <p className="text-lg font-bold">🎉 Congratulations!</p>
                      <p className="text-sm">
                        Code ROYAL15 applied. You saved {fmt(discount)}!
                      </p>
                      <button
                        className="text-sm underline mt-1"
                        onClick={removeCode}
                      >
                        Remove code
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            setCodeError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApply()}
                          className="flex-1 min-w-0 mr-2 h-10 px-3 border focus:outline-none focus:ring-1 rounded-md"
                          placeholder="Enter Your Royal Code"
                        />
                        <button
                          className="px-6 rounded-md bg-[#264726] text-white hover:bg-[#1E381E]"
                          onClick={handleApply}
                        >
                          Apply
                        </button>
                      </div>
                      {codeError && (
                        <p className="text-red-600 text-sm mt-1">{codeError}</p>
                      )}
                    </>
                  )}
                </div>

                <button
                  onClick={proceed}
                  className="w-full bg-[#264726] mt-3 py-3 text-lg shadow-xl font-bold text-white rounded-lg hover:bg-[#1E381E]"
                >
                  PROCEED TO PAY
                </button>

                <div className="flex justify-evenly rounded-xl py-3 bg-[#f6f7f6]">
                  <div className="flex flex-col items-center text-center w-20 sm:w-24 text-xs sm:text-sm">
                    <MdOutlineSecurity className="text-lg" />
                    <p>Secure Checkout</p>
                  </div>
                  <div className="flex flex-col items-center text-center w-20 sm:w-24 text-xs sm:text-sm">
                    <GoGift className="text-lg" />
                    <p>Luxury Packaging</p>
                  </div>
                  <div className="flex flex-col items-center text-center w-20 sm:w-24 text-xs sm:text-sm">
                    <TfiMedall className="text-lg" />
                    <p>Premium Service</p>
                  </div>
                </div>
                <p className="rounded-xl py-2 px-4 text-center text-sm bg-[#f6f7f6]">
                  Prices include all applicable taxes. Expected delivery: 2-3
                  business days
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Checkout
        open={checkout}
        onClose={() => setCheckout(false)}
        coupon={applied ? "ROYAL15" : ""}
        total={total}
      />
      <Footer />
    </div>
  );
};

export default Cart;
