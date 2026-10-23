import React from "react";
import Home from "./Components/Home";
import Productdetails from "./Components/ProductDetails";
import { Routes, Route, } from "react-router-dom";
import AuthShell from "./Components/AuthShell";
import Orders from "./Components/Orders";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Marketing from "./admin/Marketing";
import Products from "./admin/Products";
import Categories from "./admin/Categories";
import Banners from "./admin/Banners";
import AdminOrders from "./admin/Orders";
import Users from "./admin/Users";
import Women from "./Components/Women";
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";
import About from "./Components/About";
import Shop from "./Components/Shop";
import Necklase from "./Components/Necklase";
import ScrollToTop from "./Components/ScrollToTop";



const App = () => {
  return (
    <div className="w-full overflow-x-clip">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productdetails/:productname/:id" element={<Productdetails />} />
        <Route element={<AuthShell />}>
          <Route path="/login" />
          <Route path="/signup" />
        </Route>
        <Route path="/women" element={<Women />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="banners" element={<Banners />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/necklase" element={<Necklase />} />
      </Routes>
    </div>
  );
};

export default App;
