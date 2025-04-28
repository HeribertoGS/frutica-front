import React, { createContext, useContext, useState, useEffect } from 'react';
import { agregarAListaDeseos, quitarDeListaDeseos, obtenerListaDeseos } from '../service/api';

interface WishlistContextType {
  wishlist: number[];
  toggleWishlist: (productoId: number) => Promise<void>;
  isInWishlist: (productoId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: async () => {},
  isInWishlist: () => false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await obtenerListaDeseos();
        setWishlist(data.map((item: any) => item.producto.producto_k));
      } catch (err) {
        console.error('❌ Error al cargar la lista de deseos:', err);
      }
    };
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productoId: number) => {
    try {
      if (wishlist.includes(productoId)) {
        await quitarDeListaDeseos(productoId);
        setWishlist(prev => prev.filter(id => id !== productoId));
      } else {
        await agregarAListaDeseos(productoId);
        setWishlist(prev => [...prev, productoId]);
      }
    } catch (err) {
      console.error('❌ Error al actualizar lista de deseos:', err);
    }
  };

  const isInWishlist = (productoId: number) => wishlist.includes(productoId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
