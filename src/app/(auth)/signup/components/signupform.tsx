"use client";

import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { FC, useState } from "react";
import { signupAction } from "@/app/actions/signup-action";
import toast from "react-hot-toast";

interface ZodError {
  _errors: string[];
}
interface FieldErrors {
  firstname?: ZodError;
  lastname?: ZodError;
  email?: ZodError;
  password?: ZodError;
  classref?: ZodError;
}

const SignupForm: FC = () => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    password: undefined,
    classref: undefined,
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      setFieldErrors({
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        password: undefined,
        classref: undefined,
      });
      const result: any = await signupAction({
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        classref: formData.get("classref") as string,
      });

      if (result!.success) {
        toast.success(result.message);
      } else {
        if (result.validationErrors) {
          setFieldErrors(result.validationErrors);
        } else if (result.data?.validationErrors) {
          setFieldErrors(result.data.validationErrors);
        } else {
          if (result.data.success) {
            toast.success(result.data.message);
          } else {
            toast.error(result.message || "Signup failed");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during signup");
    }
  };

  return (
    <form className="bg-white p-4" action={handleSubmit}>
      <div className="text-2xl font-semibold">
        Focus on ideas, not formatting.
      </div>
      <div className="text-2xl font-semibold opacity-50">
        Create a chnawa account
      </div>
      <div className="mt-5 flex flex-col space-y-4">
        <InputWithLabel
          name="firstname"
          placeholder="firstname"
          label="firstname"
          error={fieldErrors.firstname?._errors[0]}
        />
        <InputWithLabel
          name="lastname"
          placeholder="lastname"
          label="lastname"
          error={fieldErrors.lastname?._errors[0]}
        />
        <InputWithLabel
          name="classref"
          type="text"
          placeholder="Your class name"
          label="class name"
          error={fieldErrors.classref?._errors[0]}
        />
        <InputWithLabel
          name="email"
          placeholder="email"
          label="email"
          error={fieldErrors.email?._errors[0]}
        />
        <InputWithLabel
          name="password"
          placeholder="password"
          label="password"
          type="password"
          error={fieldErrors.password?._errors[0]}
        />
        <Button>Create account</Button>
      </div>
    </form>
  );
};

export default SignupForm;
