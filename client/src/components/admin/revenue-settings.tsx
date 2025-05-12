import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const revenueSettingsSchema = z.object({
  platformFeePercentage: z.coerce.number().min(0).max(100).default(30),
  developerShare: z.coerce.number().min(0).max(100).default(70),
  platformFee: z.coerce.number().min(0).max(100).default(30),
  minimumPayoutAmount: z.coerce.number().min(0).default(1000),
  payoutThreshold: z.coerce.number().min(0).default(5000),
  payoutDay: z.coerce.number().min(1).max(28).default(15),
  premiumSubscriptionPrice: z.coerce.number().min(0).default(999),
  payoutSchedule: z.enum(["weekly", "biweekly", "monthly"]).default("monthly"),
});

export default function RevenueSettings() {
  const { toast } = useToast();

  // Fetch current revenue settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["/api/admin/revenue/settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/revenue/settings");
      if (!res.ok) {
        throw new Error("Failed to fetch revenue settings");
      }
      return await res.json();
    },
  });

  // Setup form
  const form = useForm<z.infer<typeof revenueSettingsSchema>>({
    resolver: zodResolver(revenueSettingsSchema),
    defaultValues: {
      platformFeePercentage: 30,
      developerShare: 70,
      platformFee: 30,
      minimumPayoutAmount: 1000,
      payoutThreshold: 5000,
      payoutDay: 15,
      premiumSubscriptionPrice: 999,
      payoutSchedule: "monthly",
    },
  });

  // Update form values when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        platformFeePercentage: Number(settings.platformFeePercentage),
        developerShare: settings.developerShare,
        platformFee: settings.platformFee,
        minimumPayoutAmount: settings.minimumPayoutAmount,
        payoutThreshold: settings.payoutThreshold,
        payoutDay: settings.payoutDay,
        premiumSubscriptionPrice: settings.premiumSubscriptionPrice,
        payoutSchedule: settings.payoutSchedule,
      });
    }
  }, [settings, form]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof revenueSettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/revenue/settings", formData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update settings");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Revenue settings have been updated successfully",
      });
      // Invalidate the query to refetch settings
      queryClient.invalidateQueries({ queryKey: ["/api/admin/revenue/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof revenueSettingsSchema>) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading revenue settings</p>
        <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Settings</CardTitle>
        <CardDescription>
          Configure how revenue is distributed to developers and when payouts occur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Platform Revenue</h3>
                
                <FormField
                  control={form.control}
                  name="platformFeePercentage"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Platform Fee Percentage</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input type="number" {...field} className="w-24" />
                          <span className="ml-2">%</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Fee percentage that JagJar keeps from total revenue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="developerShare"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Developer Share</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input type="number" {...field} className="w-24" />
                          <span className="ml-2">%</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Percentage of revenue distributed to developers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="platformFee"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Platform Fee</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input type="number" {...field} className="w-24" />
                          <span className="ml-2">%</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Platform fee percentage (should match platform fee percentage above)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="premiumSubscriptionPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium Subscription Price</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <Input 
                            type="number" 
                            {...field} 
                            className="w-32"
                            onChange={(e) => {
                              // Convert to cents
                              const value = parseFloat(e.target.value);
                              field.onChange(Math.round(value * 100));
                            }}
                            value={(field.value / 100).toFixed(2)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Monthly price for premium subscription
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Payout Settings</h3>
                
                <FormField
                  control={form.control}
                  name="minimumPayoutAmount"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Minimum Payout Amount</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <Input 
                            type="number" 
                            {...field} 
                            className="w-32"
                            onChange={(e) => {
                              // Convert to cents
                              const value = parseFloat(e.target.value);
                              field.onChange(Math.round(value * 100));
                            }}
                            value={(field.value / 100).toFixed(2)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Minimum amount required for a developer to receive a payout
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="payoutThreshold"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Payout Threshold</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <Input 
                            type="number" 
                            {...field} 
                            className="w-32"
                            onChange={(e) => {
                              // Convert to cents
                              const value = parseFloat(e.target.value);
                              field.onChange(Math.round(value * 100));
                            }}
                            value={(field.value / 100).toFixed(2)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Earnings must exceed this amount for payout processing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="payoutDay"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Payout Day</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="w-24"
                          min={1}
                          max={28}
                        />
                      </FormControl>
                      <FormDescription>
                        Day of month when payouts are processed (1-28)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="payoutSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Schedule</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a schedule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Biweekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How frequently payments are distributed to developers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-32"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}