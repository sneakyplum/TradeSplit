"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const JobberButton = () => {

  const jobberOauth = async () => {
    const jobberOauthResult = await authClient.oauth2.link({
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