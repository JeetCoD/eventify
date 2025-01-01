import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src="/assets/images/favicon.ico"
            alt="logo"
            width={32}
            height={32}
          />{" "}
          <p className="text-2xl font-semibold">Eventify</p>
        </Link>
        <p>{currentYear} Eventify. All rights reserved.</p>
      </div>
    </footer>
  );
}
