// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState } from "react";

type Producto = {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
};

type WishlistContextType = {
    wishlist: Producto[];
    toggleWishlist: (producto: Producto) => void;
    isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Producto[]>([]);

    const toggleWishlist = (producto: Producto) => {
        setWishlist((prev) =>
            prev.find((item) => item.id === producto.id)
                ? prev.filter((item) => item.id !== producto.id)
                : [...prev, producto]
        );
    };

    const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
};
