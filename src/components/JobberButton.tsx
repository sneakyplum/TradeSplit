"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const JobberButton = () => {

  const jobberOauth = async () => {
    const jobberOauthResult = await authClient.signIn.oauth2({
      providerId: "jobber", // required
      callbackURL: "/dashboard",
    });
  };

  return (
    <div>
      <Button onClick={jobberOauth}>Sign in with Jobber</Button>
    </div>
  )
}

export default JobberButton