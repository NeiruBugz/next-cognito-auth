import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen items-center justify-between p-24">
      <Button variant="link">
        <Link href="/auth/signup" className="mr-2">
          Sign Up
        </Link>
      </Button>
      <Button variant="link">
        <Link href="/auth/login">Login</Link>
      </Button>
    </main>
  );
}
