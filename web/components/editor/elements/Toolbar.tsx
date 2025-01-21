"use client";
import React from "react";

export const Toolbar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="py-2 bg-[#EFE5D2] flex rounded-xl mx-auto overflow-auto">
    {children}
  </div>
);
