"use client";

import JobberButton from "@/components/JobberButton";
import { useEffect, useState } from "react";
// You don't actually need loadStripe for this redirect method, so we can omit it to save space

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handlePay = async (invoiceId: string, balance: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: balance, 
          invoiceId: invoiceId 
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.assign(url);
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/jobber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query SampleTask {
                invoices {
                  nodes {
                    id
                    amounts {
                      total
                      invoiceBalance
                    }
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();
        
        // --- PRO TIP: If Jobber is empty, inject a fake invoice so you can test Stripe! ---
        if (!result.data?.invoices?.nodes || result.data.invoices.nodes.length === 0) {
           console.log("No real invoices found, showing a test invoice.");
           result.data = {
             invoices: {
               nodes: [
                 { id: "MOCK-123", amounts: { total: "750.00", invoiceBalance: "750.00" } }
               ]
             }
           };
        }

        setUserData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10">Loading Dashboard...</div>;

  const invoices = userData?.data?.invoices?.nodes || [];

  return (
    <div className="p-10">
      <JobberButton />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Your Invoices</h2>
      
      {invoices.length === 0 ? (
        <p>No invoices found in your Jobber account.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice: any) => (
            <div key={invoice.id} className="border p-4 rounded-lg flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-lg">Invoice #{invoice.id}</p>
                <p className="text-gray-600">Total: ${invoice.amounts.total}</p>
                <p className="text-blue-600 font-medium">Balance: ${invoice.amounts.invoiceBalance}</p>
              </div>
              
              <button 
                onClick={() => handlePay(invoice.id, invoice.amounts.invoiceBalance)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Pay with Klarna
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;