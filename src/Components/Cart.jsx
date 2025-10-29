import React, { useContext, useState } from "react";
import { CartContext } from "../context/Cart";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdChevronLeft } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { MdOutlineSecurity } from "react-icons/md";
import { GoGift } from "react-icons/go";
import { TfiMedall } from "react-icons/tfi";
import { woomen } from "../Data/women";

const Cart = () => {
  const cart = useContext(CartContext);
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState();

  const subTotal = cart.item.reduce((a, b) => a + b.price, 0);

  const total = subTotal - discount;


  const removeFromCart = (id) => {
    const updateItem = cart.item.filter((p) => p.id !== id);
    cart.setItem(updateItem);
  };

  function handleApply() {
    if (code.trim().toUpperCase() === "royal15") {
      setDiscount(subTotal * 0.2);
    } else {
      setDiscount(0);
      alert = "invalid code";
    }
  }


  // const { id } = useParams();

  // const products = woomen.find((item) => item.id === parseInt(id));

  return (
    <div>
      <Navbar />
      <div className="w-full h-full px-36 py-20 bg-[#F8F1E7]">
        <h1 className="text-[#1E381E] font-bold mb-7 ml-10 text-4xl ">
          Shopping Cart
        </h1>
        <div className="flex justify-between px-10 gap-10 ">
          <div className=" bg-white rounded-md h-full w-[80%]">
            <div>
              <div className="px-5 py-7 flex justify-between">
                <h3 className="text-[#1E381E] text-2xl">Your Selections</h3>
                <p className="bg-[#EDEFED] px-5 py-1 rounded-2xl">
                  {cart.item.length} item
                </p>
              </div>
              <hr />
              <hr />

              {cart &&
                cart.item.map((img, index) => (
                  <div className="flex gap-5 px-5 py-5" key={index }>
                    <div className="w-40 h-40 relative object-cover shadow-[8px_8px_0px_#E4E8E6] group overflow-hidden rounded-2xl cursor-pointer">
                      <img
                        src={img.img}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity  duration-500 opacity-100 group-hover:opacity-0"
                        alt="Craft 1"
                      />
                      <img
                        src={img.img2}
                        className="absolute inset-0  h-full w-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        alt="Craft 2"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <div className=" ">
                        <div className="flex justify-between">
                          <Link className="font-bold text-lg">{img.name}</Link>
                          <p className="text-2xl">₹{img.price}</p>
                        </div>
                        <div className="mt-2">
                          <span className="text-[#264726]">Brand | </span>
                          <span className="text-gray-600">Biba</span>
                        </div>
                        <div>
                          <span className="text-[#264726]">Color | </span>
                          <span className="text-gray-600">Pink</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-20">
                        <div className="flex  gap-5">
                          <button
                            className="flex justify-center px-[6px] py-[-5px] rounded-lg bg-green-100 text-[#264726] gap-2 items-center"
                            onClick={() => {
                              // Prevent duplicates
                              if (!cart.wishlist.find((w) => w.id === img.id)) {
                                cart.setWishlist([...cart.wishlist, img]);
                              }
                            }}
                          >
                            <CiHeart className="hover:scale-110" />
                            Wishlist
                          </button>
                          <button
                            className="flex justify-center  gap-2 px-[6px] py-[-5px] text-red-600 rounded-lg bg-red-100 items-center"
                            onClick={() => removeFromCart(img.id)}
                          >
                            <RiDeleteBinLine className="hover:scale-110" />
                            Remove
                          </button>
                        </div>
                        <div className="flex justify- gap-5 items-center">
                          <h3>Quantity</h3>
                          <select
                            name=""
                            id=""
                            className="border w-20 px-2 py-1 rounded-lg"
                          >
                            <option value="">1</option>
                            <option value="">2</option>
                            <option value="">3</option>
                            <option value="">4</option>
                            <option value="">5</option>
                            <option value="">6</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <hr />
              <hr />
              <div className="flex justify-between px-5 py-5">
                <Link to="/women">
                  <p className="flex justify-center text-[#264726] items-center gap-2">
                    <MdChevronLeft />
                    Continue Shopping
                  </p>
                </Link>
                <p className="text-gray-600">Free shipping on all orders</p>
              </div>
            </div>
          </div>

          <div className="w-[50%] max-h-[20%]  rounded-lg bg-white">
            <div>
              <div className=" rounded-t-lg">
                <h1 className="flex justify-start items-center ml-5 gap-3 py-7  text-[#264726] font-bold text-2xl">
                  <LuCrown />
                  Order Summary
                </h1>
              </div>
              <hr />
              <hr />
              <div className="px-4 mt-5">
                <div className="flex justify-between">
                  <h3>Merchandise Subtotal</h3>
                  <p>₹{subTotal}</p>
                </div>
                <div className="flex justify-between mb-5 mt-3">
                  <h3 className="flex justify-start items-center gap-1 ">
                    Premium Delivery
                    <TfiMedall className="w-4 h-4 p-[2px] bg-[#EDEFED] text-black  rounded-xl" />
                  </h3>
                  <p className="text-[#264726]">Complimentary</p>
                </div>

                {/* {discount > 0 && (
                  <div className="flex justify-between my-3 text-green-700">
                    <h3>Royal Discount (20%)</h3>
                    <p>- ₹{discount.toFixed(2)}</p>
                  </div>
                )} */}
                <hr />
                <hr />
                <div className="flex justify-between mt-5 mb-5">
                  <h1>Order Total</h1>
                  <p className="text-2xl font-bold">₹{total}</p>
                </div>
                <hr />
                <hr />

                <div className="mt-5">
                  <p className="text-[#264726] mb-3">Exclusive Code</p>
                  <div className="flex justify-between">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-64 h-10 px-2 border   focus:outline-none focus:ring-1 rounded-md"
                      placeholder="Enter Your Royal Code"
                    />
                    <button
                      className="px-10 py-1 rounded-md  bg-[#264726] text-white text-md"
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  </div>
                  <button className="w-full bg-[#264726] my-5 py-3 text-lg shadow-xl font-bold text-white rounded-lg">
                    PROCEED TO PAY
                  </button>
                  <div className="flex justify-evenly rounded-xl py-2 bg-[#f6f7f6]  ">
                    <div className="flex flex-col items-center text-center  w-24">
                      <MdOutlineSecurity />
                      <p>Secure Checkout</p>
                    </div>
                    <div className=" flex flex-col items-center text-center w-24">
                      <GoGift />
                      <p>Luxury Packaging</p>
                    </div>
                    <div className="flex flex-col items-center text-center w-24">
                      <TfiMedall />
                      <p>Premium Service</p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-5  rounded-xl py-2 px-8 text-center mb-5 bg-[#f6f7f6] ">
                    <p>
                      Prices include all applicable taxes Expected delivery: 2-3
                      business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
