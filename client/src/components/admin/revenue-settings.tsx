import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const revenueSettingsSchema = z.object({
  platformFeePercentage: z.coerce.number().min(1).max(99),
  developerShare: z.coerce.number().min(1).max(99),
  minimumPayoutAmount: z.coerce.number().min(100).max(10000),
  payoutSchedule: z.enum(["weekly", "biweekly", "monthly"]),
  premiumSubscriptionPrice: z.coerce.number().min(100).max(10000),
  highPerformanceBonusThreshold: z.coerce.number().min(60).max(10000),
  highPerformanceBonusMultiplier: z.coerce.number().min(1).max(5),
});

type RevenueSettingsFormValues = z.infer<typeof revenueSettingsSchema>;

export default function RevenueSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["/api/admin/revenue/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/revenue/settings", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch revenue settings");
      }
      
      return await response.json();
    },
  });

  // Default values for the form
  const defaultValues: RevenueSettingsFormValues = {
    platformFeePercentage: 30,
    developerShare: 70,
    minimumPayoutAmount: 1000,
    payoutSchedule: "monthly",
    premiumSubscriptionPrice: 1999,
    highPerformanceBonusThreshold: 120,
    highPerformanceBonusMultiplier: 1.5,
  };

  // Create form with react-hook-form
  const form = useForm<RevenueSettingsFormValues>({
    resolver: zodResolver(revenueSettingsSchema),
    defaultValues: settings || defaultValues,
  });

  // Reset form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  // Mutation for updating settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: RevenueSettingsFormValues) => {
      const response = await apiRequest("PUT", "/api/admin/revenue/settings", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Revenue settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/revenue/settings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update revenue settings.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: RevenueSettingsFormValues) {
    updateSettingsMutation.mutate(data);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Revenue Settings</h2>
        <p className="text-muted-foreground">
          Configure platform revenue sharing and payout settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Fee and Revenue Sharing</CardTitle>
              <CardDescription>
                Configure how revenue is split between the platform and developers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="platformFeePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Fee Percentage</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={99}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            {...field}
                            className="w-20"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <span>%</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Percentage of revenue retained by the platform
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="developerShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Developer Share</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={99}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            {...field}
                            className="w-20"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <span>%</span>
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
                  name="premiumSubscriptionPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium Subscription Price</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <span>$</span>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Monthly price for premium subscriptions (in cents)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payouts Configuration</CardTitle>
              <CardDescription>
                Set payout schedules and minimum thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="minimumPayoutAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Payout Amount</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <span>$</span>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Minimum earnings required for payout (in cents)
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a schedule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often payouts are processed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Bonuses</CardTitle>
              <CardDescription>
                Configure bonuses for high-performing websites
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="highPerformanceBonusThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>High Performance Threshold</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <span className="text-muted-foreground">minutes</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Minutes per month required to qualify for bonus
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highPerformanceBonusMultiplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus Multiplier</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={5}
                            step={0.1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            {...field}
                            className="w-20"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <span>x</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Revenue multiplier for high-performing websites
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending || isLoadingSettings}
              className="flex-1 sm:flex-initial"
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(settings)}
              disabled={updateSettingsMutation.isPending || isLoadingSettings}
              className="flex-1 sm:flex-initial"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}