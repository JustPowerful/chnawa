"use client";

import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input-with-label";

interface SignInFormProps {}

const SignInForm: FC<SignInFormProps> = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-2xl font-semibold">Sign into your account. </div>
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
        <Button className="w-full">Continue</Button>
      </div>

      {/* <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div> */}
    </form>
  );
};

export default SignInForm;
