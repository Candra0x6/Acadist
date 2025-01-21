"use client";
import Image from "next/image";
import React from "react";
import AcadistLogo from "@/public/assets/svg/AcadistLogo.svg";
import { Button } from "../ui/button";
const NavbarList = [
  {
    name: "Pricing",
    href: "#pricing",
  },
  {
    name: "FAQ",
    href: "#faq",
  },
  {
    name: "Demo",
    href: "/dashboard",
  },
];
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="">
        <Image src={AcadistLogo} alt={"Logo"} width={50} height={50} />
      </div>
      <div className="flex gap-2">
        {NavbarList.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="block mt-4 lg:inline-block lg:mt-0 font-semibold mr-4 text-lg"
          >
            {item.name}
          </a>
        ))}
      </div>
      <Button className="border-2 border-orange-500 px-8 ">Login</Button>
    </nav>
  );
}
