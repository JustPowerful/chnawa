import { FC } from "react";
import SignupForm from "./components/signupform";
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignupForm />
    </div>
  );
};

export default page;
