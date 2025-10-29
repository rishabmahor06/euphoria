import React from "react";
import Home from "./Components/Home";
import Productdetails from "./Components/ProductDetails";
import { Routes, Route, } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Women from "./Components/Women";
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";



const App = () => {
  return (
    <div className="bg-[#00000000]  w-full overflow-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="//productdetails/:productname/:id" element={<Productdetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/women" element={<Women />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </div>
  );
};

export default App;
