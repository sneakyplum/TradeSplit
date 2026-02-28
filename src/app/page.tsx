"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";



export default function Home() {

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard" // Optional: Redirect after successful sign-in
    });
  };

  return (
    <main>
      <header className="text-7xl font-bold bg-black top-0 absolute w-full flex">
        <div className="w-full h-full items-center justify-center flex">
          <Button onClick={signIn} className="bg-blue-600">Sign in with Google</Button>

        </div>

      </header>
      <div className="flex min-h-screen flex-col items-center justify-center">
      </div>

    </main>
  );
}
