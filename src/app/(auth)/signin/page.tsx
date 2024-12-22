import { FC } from "react";
import SignInForm from "./components/signinform";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default page;
