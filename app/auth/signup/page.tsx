"use client";
import React from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import z from "zod";
import AmplifyProvider from "../provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email().min(6, "Email is required"),
  password: z.string().min(8, "Password is required"),
});

const confirmationSchema = z.object({
  confirmationCode: z.string(),
});

type SignUpFields = z.infer<typeof signUpSchema>;

type ConfirmationFields = z.infer<typeof confirmationSchema>;

export default function Page() {
  const [isConfirmation, setConfirmation] = React.useState(false);
  const [username, setUsername] = React.useState<string>("");
  const methods = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });
  const { register, handleSubmit } = useForm<ConfirmationFields>({
    resolver: zodResolver(confirmationSchema),
  });
  const router = useRouter();

  const onSubmit = async ({ username, email, password }: SignUpFields) => {
    const isValid = await methods.trigger();
    if (isValid) {
      try {
        setUsername(username);
        const { user } = await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          },
          autoSignIn: {
            enabled: false,
          },
        });
        console.log(user);
        user && setConfirmation(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const confirmCode = async ({ confirmationCode }: ConfirmationFields) => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AmplifyProvider>
      {isConfirmation ? (
        <div
          className="container mx-auto h-screen"
          onSubmit={handleSubmit(confirmCode)}
        >
          <form className="flex flex-col gap-2">
            <input
              type="text"
              id="confirmationCode"
              {...register("confirmationCode")}
            />
            <input type="submit" />
          </form>
        </div>
      ) : (
        <div
          className="container mx-auto h-screen"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <form className="flex flex-col gap-2">
            <input
              type="email"
              id="email"
              placeholder="email"
              {...methods.register("email")}
            />
            <input
              type="text"
              id="username"
              placeholder="username"
              {...methods.register("username")}
            />
            <input
              type="password"
              id="password"
              placeholder="password"
              {...methods.register("password")}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
    </AmplifyProvider>
  );
}
