"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getContract } from "@/lib/contract";

interface Transaction {
  buyer: string;
  seller: string;
  amount: number;
  price: number;
  timestamp: number;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const contract = await getContract();
        // Listen for TransactionPerformed events
        contract.on("TransactionPerformed", (buyer, seller, amount, price, event) => {
          setTransactions(prev => [{
            buyer,
            seller,
            amount: Number(amount),
            price: Number(price),
            timestamp: Date.now(),
          }, ...prev]);
        });
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount (kWh)</TableHead>
              <TableHead>Price (ETH/kWh)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                <TableCell className="font-mono">{tx.buyer.slice(0, 6)}...{tx.buyer.slice(-4)}</TableCell>
                <TableCell className="font-mono">{tx.seller.slice(0, 6)}...{tx.seller.slice(-4)}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}