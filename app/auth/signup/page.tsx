"use client";
import { redirect } from 'next/navigation';
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import z from "zod";
import AmplifyProvider from '../provider';

const signUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(6, "Username is required"),
  password: z.string().min(8, "Password is required"),
});

type SignUpFields = z.infer<typeof signUpSchema>;

export default function Page() {
  const methods = useForm<SignUpFields>();

  const onSubmit = async ({ email, username, password }: SignUpFields) => {
    const isValid = await methods.trigger();
    if (isValid) {
      try {
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
        redirect('/');
        console.log(user);
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
    </main>
    </AmplifyProvider>
  );
}
