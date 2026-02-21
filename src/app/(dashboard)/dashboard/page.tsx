"use client";

import JobberButton from "@/components/JobberButton";
// import { Button } from "@/components/ui/button"
// import { auth } from "@/lib/auth";
// import { authClient } from "@/lib/auth-client";
// import { headers } from "next/headers";
import { useEffect, useState } from "react";


const Dashboard = () => {

  // const jobberAuth = async () => {
  //   const jobberOauth = await authClient.signIn.oauth2({
  //     providerId: "jobber", // required
  //     callbackURL: "/dashboard",

  //   });

  // }

    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/jobber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
            `,
          }),
        });

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <JobberButton />
      {/* <h1>Status: {session ? "Connected" : "Not Connected"}</h1>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre> */}
      {userData && (
      <div>
        {/* To get the cost: extensions -> cost -> actualQueryCost */}
        <p>Query Cost: {userData.data?.invoices?.nodes[0]?.amounts?.total}</p>
        
        {/* To get the jobs: data -> jobs -> nodes (it's an array!) */}
        <h3>Invoices:</h3>
        <ul>
          {userData.data?.invoices?.nodes.map((invoice: any) => (
            <li key={invoice.id}>
              Invoice #{invoice.id}: ${invoice.amounts.total} (Balance: ${invoice.amounts.invoiceBalance})
            </li>
          ))}
        </ul>
        
        {/* If the array is empty, show a fallback */}
        {userData.data?.jobs?.nodes.length === 0 && <p>No jobs found.</p>}
      </div>
    )}
    </div>
  )
}

export default Dashboard