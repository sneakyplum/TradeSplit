
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { genericOAuth } from 'better-auth/plugins/generic-oauth'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true, // This stops the "email doesn't match" error
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL, 
  socialProviders: {
      google: { 
          clientId: process.env.GOOGLE_CLIENT_ID as string, 
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
      },
  },
  plugins: [
    genericOAuth({ 
      config: [ 
        { 
          providerId: "jobber", 
          clientId: process.env.JOBBER_CLIENT_ID!, 
          clientSecret: process.env.JOBBER_CLIENT_SECRET!, 
          authorizationUrl: "https://api.getjobber.com/api/oauth/authorize",
          tokenUrl: "https://api.getjobber.com/api/oauth/token",
          //redirectURI: "https://api.getjobber.com/api/oauth/authorize",

          getUserInfo: async (tokens) => {
            if (!tokens.accessToken) {
              console.error("No access token received from Jobber.");
              return null;
            }

            try {
              const response = await fetch("https://api.getjobber.com/api/graphql", {
                method: "POST",
                headers: {
                  // Now 'tokens.accessToken' is guaranteed to be a string here
                  "Authorization": `Bearer ${tokens.accessToken}`, 
                  "Content-Type": "application/json",
                  "X-Jobber-Graphql-Version": "2024-04-02", 
                },
                body: JSON.stringify({
                  query: `query { account { name } }` 
                }),
              });

              const result = await response.json();
              const accountName = result.data?.account?.name || "Jobber Account";

              return {
                // Use the token to generate a unique ID for this session
                id: `jobber-${tokens.accessToken.slice(-10)}`, 
                email: `${tokens.accessToken.slice(-10)}@jobber-user.com`,
                name: accountName,
                emailVerified: true,
              };
            } catch (error) {
              console.error("GraphQL Fetch Failed:", error);
              return null;
            }
          },

          scopes: ["clients", "invoices"]
        }, 
          // Add more providers as needed
      ] 
    }) 
  ]
})