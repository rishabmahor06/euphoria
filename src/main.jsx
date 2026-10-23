import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Toaster from "./Components/Toaster";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/Cart";
import { CatalogProvider } from "./context/Catalog";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <CartProvider>
          <App />
          <Toaster />
        </CartProvider>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>
);
