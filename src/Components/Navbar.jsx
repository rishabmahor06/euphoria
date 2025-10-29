import logo from "../assets/Collage/euphoria.webp";
import { CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
import { BiUser } from "react-icons/bi";
import { NavLink, Link } from "react-router-dom";
import React, { useContext } from "react";
import { CartContext } from "../context/Cart";

const Navbar = () => {

    const cart = useContext(CartContext);


  return (
    <div>
      <div className="bg-[#183818] text-white text-center py-2 sticky">
        <h1>
          Use Code:{" "}
          <Link to="" className="underline">
            royal15
          </Link>{" "}
          for Extra Discount
        </h1>
      </div>
      <div className="flex align-center shadow-2xl justify-between shadow-4xl bg-white px-7 py-2">
        <div>
          <h1>
            <img src={logo} alt="" />
          </h1>
        </div>
        <div>
          <ul className="flex gap-8  text-black text-xl  mt-3 ml-20">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-red-600 font-bold " : "text-black-600"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "text-red-600 font-bold " : "text-black"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  isActive ? "text-blue-red font-bold " : "text-black"
                }
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/necklase"
                className={({ isActive }) =>
                  isActive ? "text-red-600 font-bold " : "text-black"
                }
              >
                Necklase
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/women"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold " : "text-black"
                }
              >
                Women
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex gap-4 text-black text-xl font-bold mt-3 ml-20">
            <li>
              <CiSearch className="h-6 w-6 text-black" />
            </li>
            <li>
              <Link to="/login">
                <BiUser className="h-6 w-6 text-black" />
              </Link>
            </li>
            <li>
              <Link to="/wishlist"><CiHeart className="h-6 w-6 text-black" /></Link>
            </li>
            <li>
              <Link to="/cart">
                <CiShoppingCart className="h-6 w-6 text-black" />
                <span className="px-1 absolute top-14 right-3  bg-yellow-400 text-sm rounded-3xl">{cart.item.length}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
