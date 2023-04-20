"use client";
import React from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import z from "zod";
import AmplifyProvider from "../provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AmplifyProvider>
      {isConfirmation ? (
        <div
          className="container mx-auto h-screen p-8 flex items-center"
          onSubmit={handleSubmit(confirmCode)}
        >
          <form className="flex flex-col gap-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Username</Label>
              <Input type="text" id="username" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Confirmation code</Label>
              <Input
                type="text"
                id="confirmationCode"
                {...register("confirmationCode")}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button>Submit</Button>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="container mx-auto h-screen flex justify-center items-center"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <form className="flex flex-col gap-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                {...methods.register("email")}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Username"
                {...methods.register("username")}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                {...methods.register("password")}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Button>Submit</Button>
            </div>
          </form>
        </div>
      )}
    </AmplifyProvider>
  );
}
