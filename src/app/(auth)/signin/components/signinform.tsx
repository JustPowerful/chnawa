"use client";

import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Loader2 } from "lucide-react";

const SignInForm: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/dashboard"); // Redirect to dashboard after successful sign in
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-2xl font-semibold">
        Sign into your <span className="opacity-50">chnawa!</span>{" "}
      </div>
      <div>Start doing more with chnawa!</div>
      <div className="space-y-4 mt-4">
        <InputWithLabel
          onChange={(value) => {
            setEmail(value);
          }}
          placeholder="email"
          label="email"
          type="email"
        />
        <InputWithLabel
          onChange={(value) => {
            setPassword(value);
          }}
          placeholder="password"
          label="password"
          type="password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;
