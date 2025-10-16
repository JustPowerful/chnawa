"use client";

import { FC } from "react";
import { useSession } from "next-auth/react";

const WelcomeMsg: FC = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h1 className="text-2xl">
        Welcome to your dashboard,{" "}
        <span className="font-semibold">{session?.user.firstname}!</span>
      </h1>
    </div>
  );
};

export default WelcomeMsg;
