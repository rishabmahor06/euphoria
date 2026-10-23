import { createContext, useState } from "react";

export const CartContext = createContext(null);

// Cart item:     { id, name, price, img, img2, qty }
// Wishlist item: { id, name, price, img, img2 }
export const CartProvider = (props) => {
  const [item, setItem] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product, qty = 1) =>
    setItem((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.map((p) =>
            p.id === product.id ? { ...p, qty: p.qty + qty } : p
          )
        : [...prev, { ...product, qty }]
    );

  const clearCart = () => setItem([]);

  const removeFromCart = (id) =>
    setItem((prev) => prev.filter((p) => p.id !== id));

  const updateQty = (id, qty) =>
    setItem((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.min(10, Math.max(1, qty)) } : p
      )
    );

  const addToWishlist = (product) =>
    setWishlist((prev) =>
      prev.some((w) => w.id === product.id) ? prev : [...prev, product]
    );

  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((w) => w.id !== id));

  const moveToWishlist = (id) => {
    const found = item.find((p) => p.id === id);
    if (!found) return;
    const { qty, ...product } = found; // eslint-disable-line no-unused-vars
    addToWishlist(product);
    removeFromCart(id);
  };

  const moveToCart = (id) => {
    const found = wishlist.find((w) => w.id === id);
    if (!found) return;
    addToCart(found);
    removeFromWishlist(id);
  };

  const cartCount = item.reduce((n, p) => n + p.qty, 0);
  const subTotal = item.reduce((n, p) => n + p.price * p.qty, 0);

  return (
    <CartContext.Provider
      value={{
        item,
        wishlist,
        cartCount,
        subTotal,
        addToCart,
        removeFromCart,
        clearCart,
        updateQty,
        addToWishlist,
        removeFromWishlist,
        moveToWishlist,
        moveToCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};
