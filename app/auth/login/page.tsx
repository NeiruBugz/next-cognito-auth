"use client";
import { redirect } from "next/navigation";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import z from "zod";
import AmplifyProvider from "../provider";

const signUpSchema = z.object({
  username: z.string().min(6, "Username is required"),
  password: z.string().min(8, "Password is required"),
});


type LoginFields = z.infer<typeof signUpSchema>;

export default function Page() {
  const methods = useForm<LoginFields>();

  const onSubmit = async ({ username, password }: LoginFields) => {
    const isValid = await methods.trigger();
    if (isValid) {
      try {
        const { user } = await Auth.signIn({
          username,
          password,
        });
        console.log(user);
        redirect("/");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <AmplifyProvider>
      <main className="container mx-auto h-screen">
        <form
          className="flex flex-col gap-2"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
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
      </main>
    </AmplifyProvider>
  );
}
