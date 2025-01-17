import Image from "next/image";
import logo from "@/assets/logo.png";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, LogIn, UserRoundPlus } from "lucide-react";

import { auth } from "@/lib/auth";

async function Navbar() {
  const session = await auth();
  return (
    <div className="flex items-center sticky top-0 left-0 w-full">
      <div className="px-6 bg-white shadow-[0_1px_60px_-15px_rgba(0,0,0,0.3)] shadow-zinc-600 w-full m-2 rounded-full p-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-2xl font-semibold">
          <Image src={logo} width={50} height={50} alt="chnawa logo" />
          Chnawa!
        </div>
        {session ? (
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-blue-500"
            >
              <LayoutDashboardIcon size={16} /> Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-lg">
            <Link
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                "rounded-full"
              )}
              href="/signin"
            >
              {" "}
              <LogIn /> Sign In{" "}
            </Link>

            <Link
              className={cn(buttonVariants(), "rounded-full")}
              href="/signup"
            >
              {" "}
              <UserRoundPlus /> Sign Up{" "}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col items-center justify-center p-10 gap-2">
      <Image src={logo} width={250} height={250} alt="chnawa logo" />
      <h1 className="text-6xl font-bold">Chnawa!</h1>
      <p className="text-center text-lg">
        Create and share your own{" "}
        <span className="text-blue-500">Chnawas.</span> <br /> Chnawa, a simple
        way to work on your compte rendus and share it with your professors.
      </p>
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className={cn(
            buttonVariants({
              variant: "secondary",
            })
          )}
        >
          <LogIn /> Sign In
        </Link>
        <Link href="/signup" className={cn(buttonVariants({}))}>
          <UserRoundPlus /> Create an account
        </Link>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <div className="">
      <Navbar />
      <Header />
    </div>
  );
}
