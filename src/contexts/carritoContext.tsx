import React, { createContext, useContext, useState } from "react";

export interface ProductoCarrito {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
}

interface CarritoContextProps {
    carrito: ProductoCarrito[];
    agregarAlCarrito: (producto: ProductoCarrito) => void;
    eliminarDelCarrito: (id: number) => void;
    actualizarCantidad: (id: number, cantidad: number) => void;
}

const CarritoContext = createContext<CarritoContextProps>({} as CarritoContextProps);

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

    const agregarAlCarrito = (producto: ProductoCarrito) => {
        setCarrito(prev => {
            const existe = prev.find(p => p.id === producto.id);
            if (existe) {
                return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + producto.cantidad } : p);
            } else {
                return [...prev, producto];
            }
        });
    };

    const eliminarDelCarrito = (id: number) => {
        setCarrito(prev => prev.filter(p => p.id !== id));
    };

    const actualizarCantidad = (id: number, cantidad: number) => {
        setCarrito(prev =>
            prev.map(p => p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p)
        );
    };

    return (
        <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad }}>
            {children}
        </CarritoContext.Provider>
    );
};
