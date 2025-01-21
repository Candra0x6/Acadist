import React from "react";
import AcadistLogo from "@/public/assets/svg/AcadistLogo.svg";
import Image from "next/image";
import { Button } from "../ui/button";
function Footer() {
  return (
    <footer className=" border-t border-muted-foreground py-4 ">
      <div className="max-w-8xl mx-auto flex p-20 space-x-80">
        <div className="flex flex-col gap-y-2 w-fit">
          <Image src={AcadistLogo} alt="Logo" width={70} height={70} />
          <span>
            Make easy your <br /> search
          </span>
          <h1>&copy; 2025. All rights reserved</h1>
          <Button className="mt-3 px-6 py-5 border-2 bg-primary hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary/80 dark:focus:ring-primary shadow-lg shadow-primary/50 dark:shadow-lg dark:shadow-primary/80 font-medium rounded-lg text-sm  text-center me-2 mb-2 ">
            Lets Writing <span className="text-white/80">- for free</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-x-60">
          <div className="flex flex-col gap-y-5">
            <h1 className="text-xl font-bold">Company</h1>
            <ul className="space-y-3">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-5">
            <h1 className="text-xl font-bold">Company</h1>
            <ul className="space-y-3">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-5">
            <h1 className="text-xl font-bold">Company</h1>
            <ul className="space-y-3">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
