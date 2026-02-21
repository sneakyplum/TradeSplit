import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";


export async function POST() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  const userId = session?.user.id;

  const [jobberAccount] = await Promise.all([
    prisma.account.findFirst({ where: { userId, providerId: 'jobber' } })
  ]);

  const response = await fetch("https://api.getjobber.com/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${jobberAccount?.accessToken}`,
      "X-JOBBER-GRAPHQL-VERSION": "2025-04-16",
    },
    body: JSON.stringify({
      query: `
        query SampleTask {
          invoices {
            nodes {
              amounts {
                total,
                invoiceBalance
              }
            }
          }
        }
      `
    }),
  });



  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  const userId = session?.user.id;

  const [jobberAccount] = await Promise.all([
    prisma.account.findFirst({ where: { userId, providerId: 'jobber' } })
  ]);

  const response = await fetch("https://api.getjobber.com/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jobberAccount?.accessToken}`,
      "X-JOBBER-GRAPHQL-VERSION": "2025-04-16",
    },
    body: JSON.stringify({
      query: `
        query SampleTask {
          invoices {
            nodes {
              amounts {
                total,
                invoiceBalance
              }
            }
          }
        }
      `
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}