"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getContract } from "@/lib/contract";
import { toast } from "sonner";

const bidSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  price: z.string().min(1, "Price is required"),
});

export function BidForm({ type }: { type: "demand" | "supply" }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof bidSchema>>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: "",
      price: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bidSchema>) {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const method = type === "demand" ? "demandBid" : "supplyBid";
      const tx = await contract[method](values.amount, values.price);
      await tx.wait();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} bid submitted successfully`);
      form.reset();
    } catch (error) {
      toast.error("Failed to submit bid");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "demand" ? "Place Demand Bid" : "Place Supply Bid"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Amount (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per kWh (ETH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Bid"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}