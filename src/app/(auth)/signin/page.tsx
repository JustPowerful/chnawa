import { FC } from "react";
import SignInForm from "./components/signinform";

const page: FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default page;
