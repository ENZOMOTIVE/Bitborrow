"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BidForm } from "@/components/bid-form";
import { MarketStatus } from "@/components/market-status";
import { TransactionHistory } from "@/components/transaction-history";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="trade" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="trade">Trade</TabsTrigger>
        <TabsTrigger value="market">Market Status</TabsTrigger>
        <TabsTrigger value="history">Transaction History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trade" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <BidForm type="demand" />
          <BidForm type="supply" />
        </div>
      </TabsContent>
      
      <TabsContent value="market">
        <MarketStatus />
      </TabsContent>
      
      <TabsContent value="history">
        <TransactionHistory />
      </TabsContent>
    </Tabs>
  );
}