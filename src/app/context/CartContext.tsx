import React, { createContext, useContext, useState, ReactNode } from "react";
import { Herramienta } from "@/app/data/mockData";

export interface CartItem {
  herramienta: Herramienta;
  quantity: number;
  fechaInicio: string;
  fechaFin: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    herramienta: Herramienta,
    quantity: number,
    fechaInicio: string,
    fechaFin: string,
  ) => void;
  removeItem: (herramientaId: string) => void;
  updateItem: (
    herramientaId: string,
    quantity: number,
    fechaInicio: string,
    fechaFin: string,
  ) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (
    herramienta: Herramienta,
    quantity: number,
    fechaInicio: string,
    fechaFin: string,
  ) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.herramienta.id === herramienta.id,
      );

      if (existingItem) {
        // Actualizar cantidad si ya existe
        return prevItems.map((item) =>
          item.herramienta.id === herramienta.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                fechaInicio,
                fechaFin,
              }
            : item,
        );
      }

      // Agregar nuevo item
      return [...prevItems, { herramienta, quantity, fechaInicio, fechaFin }];
    });
  };

  const removeItem = (herramientaId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.herramienta.id !== herramientaId),
    );
  };

  const updateItem = (
    herramientaId: string,
    quantity: number,
    fechaInicio: string,
    fechaFin: string,
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.herramienta.id === herramientaId
          ? { ...item, quantity, fechaInicio, fechaFin }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const inicio = new Date(item.fechaInicio);
      const fin = new Date(item.fechaFin);
      const dias =
        Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 3600 * 24)) + 1;
      return total + dias * item.herramienta.precioDia * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
