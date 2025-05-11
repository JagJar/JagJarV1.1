import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalculatorIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { format, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function RevenueTrigger() {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to previous month
    const prevMonth = subMonths(new Date(), 1);
    return format(prevMonth, "yyyy-MM");
  });

  // Generate last 12 months for dropdown
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    };
  });

  // Mutation for triggering revenue calculation
  const calculateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/revenue/calculate", { month: selectedMonth });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to calculate revenue");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Revenue calculation complete",
        description: `Successfully processed ${data.totalDistributed > 0 ? formatCurrency(data.totalDistributed) : 'revenue'} for ${format(new Date(`${selectedMonth}-01`), "MMMM yyyy")}`,
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/revenue/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/revenue/top-developers"] });
    },
    onError: (error) => {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value / 100); // Convert cents to dollars
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Revenue Distribution</CardTitle>
        <CardDescription>
          Manually trigger revenue calculations for a specific month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Select Month</label>
            <div className="flex space-x-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={calculateMutation.isPending}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {last12Months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium">What this will do:</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Calculate total premium user time spent on each website</li>
                <li>Distribute revenue to developers based on the platform's fee model</li>
                <li>Create payout records for eligible developers</li>
                <li>Update all platform analytics</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => calculateMutation.mutate()}
                disabled={calculateMutation.isPending}
                className="w-full md:w-auto"
              >
                {calculateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CalculatorIcon className="mr-2 h-4 w-4" />
                    Calculate Revenue
                  </>
                )}
              </Button>
            </div>

            {calculateMutation.isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Calculation Successful</h4>
                  <p className="text-sm mt-1">
                    {calculateMutation.data?.totalRevenue > 0
                      ? `Distributed ${formatCurrency(calculateMutation.data.totalDistributed)} to ${
                          calculateMutation.data.developerCount
                        } developers.`
                      : "No premium usage recorded for this period."}
                  </p>
                </div>
              </div>
            )}

            {calculateMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Calculation Failed</h4>
                  <p className="text-sm mt-1">
                    {calculateMutation.error instanceof Error
                      ? calculateMutation.error.message
                      : "An unknown error occurred."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}