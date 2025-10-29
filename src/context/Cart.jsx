import { createContext, useState } from "react";

export const CartContext = createContext(null);


export const CartProvider = (props)=>{
    const [item, setItem] = useState([ ]);
    const [wishlist, setWishlist] = useState([]);
    return (
        <CartContext.Provider value={{item, setItem, wishlist, setWishlist}}>
            {props.children}
        </CartContext.Provider>
    );
};


