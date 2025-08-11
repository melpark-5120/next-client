import React from "react";

export default function Header() {
  return (
    <nav className="flex items-center justify-between p-4 bg-neutral-100 text-neutral-900 shadow-md fixed top-0 left-0 right-0 z-10 backdrop-blur-sm">
      <h1 className="text-2xl font-bold text-emerald-500">Melgrow</h1>
    </nav>
  );
}
