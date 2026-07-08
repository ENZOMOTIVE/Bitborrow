"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContract } from "@/lib/contract";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function MarketStatus() {
  const [marketData, setMarketData] = useState({
    clearingPrice: 0,
    clearingQuantity: 0,
    demandBids: [],
    supplyBids: [],
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const contract = await getContract();
        const [demandBids, supplyBids] = await contract.getBids();
        const clearingPrice = await contract.clearingPrice();
        const clearingQuantity = await contract.clearingQuantity();

        setMarketData({
          clearingPrice: Number(clearingPrice),
          clearingQuantity: Number(clearingQuantity),
          demandBids,
          supplyBids,
        });
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clearing Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{marketData.clearingPrice} ETH/kWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clearing Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{marketData.clearingQuantity} kWh</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supply and Demand Curves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <LineChart width={800} height={400} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="amount" label="Energy Amount (kWh)" />
              <YAxis label="Price (ETH/kWh)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" data={marketData.demandBids} name="Demand" stroke="var(--chart-1)" />
              <Line type="monotone" dataKey="price" data={marketData.supplyBids} name="Supply" stroke="var(--chart-2)" />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}