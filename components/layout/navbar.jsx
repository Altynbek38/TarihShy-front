"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";

export default function NavBar({ session }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50)   // Only apply the useScroll hook if there's an active session

  return (
    <>
      <SignInModal />
      <div
        className={`fixed w-full ${scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
          } z-30 transition-all`}
      >
        <div className="ml-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo_main.png"
              alt="TarihShy logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p className="text-zinc-200">TarihShy AI</p>
          </Link>
          <div>
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

