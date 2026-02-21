

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const signUpPage = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div>
      <h1>Status: {session ? "Connected" : "Not Connected"}</h1>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
    </div>
  )
}

export default signUpPage