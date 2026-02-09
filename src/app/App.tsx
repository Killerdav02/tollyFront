import React from "react";
import { RouterProvider } from "react-router";
import { AuthProvider } from "../auth/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
