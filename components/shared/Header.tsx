import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="w-full border">
      <div className="wrapper flex justify-between">
        <Link href="/" className="w-8 flex gap-2 items-center">
          <Image
            src="/assets/images/favicon.ico"
            width={64}
            height={64}
            alt="Eventify"
          />
          <p className="text-2xl font-semibold">Eventify</p>
        </Link>

        {/* for desktop sites */}
        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        {/* Clerk component comes here */}
        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          {/* Render only if we are signed out */}
          <SignedOut>
            <Button asChild className="rounded-md" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
