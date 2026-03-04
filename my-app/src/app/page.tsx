"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";



export default function Home() {


  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard" // Optional: Redirect after successful sign-in
    });

    if(!data) {
      console.error("Sign-in failed: No data returned");
      return;
    } else{
      redirect("/dashboard");
    }
  };

  return (
    <main>
      <header className="text-7xl font-bold bg-gray-800 top-0 absolute w-full h-20 text-white flex items-center justify-center">
        <div className="w-full h-full items-center justify-center ">
          <div className="justify-end flex w-full h-full items-center px-4">
          <Button onClick={signIn} className="bg-blue-600">Sign in with Google</Button>

          </div>

        </div>

      </header>
      <div className="bg-gray-300">
        <div className="flex flex-col items-center pt-50">
          <h1 className="text-6xl font-bold pb-20">Welcome to TradeSplit</h1>
          <div >
            <h4 className="text-xl text-center font-black w-3xl">TradeSplit is a platform that allows Trades business owners to get paid faster without the hassle of chasing down payments. With TradeSplit, you can easily split your invoices and get paid in installments, giving you more cash flow and flexibility. Say goodbye to late payments and hello to a smoother financial future with TradeSplit.
            </h4>

          </div>
        </div>
        <div className="flex justify-center py-10">
          <Button onClick={signIn} className="text-2xl bg-blue-600 items-center p-6">Sign up now</Button>
        </div>
      </div>
      <div className="bg-gray-400 flex flex-col items-center py-20">
        <h4 className="text-xl text-center font-black w-3xl py-20 flex items-center justify-center">
          Built with trusted brands such as Jobber, Stripe, Klarna you dont have to worry about the security of your payments. 
        </h4>
      </div>
    </main>
  );
}
