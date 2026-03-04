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
    <div >
      <Button onClick={signIn}>Sign in with Google</Button>
    </div>
  );
}
