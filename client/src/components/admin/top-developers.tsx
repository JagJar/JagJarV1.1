import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarIcon } from "lucide-react";
import { format, subMonths } from "date-fns";

export default function TopDevelopers() {
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

  // Fetch top earning developers for the selected month
  const {
    data: developers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/admin/revenue/top-developers", selectedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/admin/revenue/top-developers/${selectedMonth}`);
      if (!res.ok) {
        throw new Error("Failed to fetch top developers");
      }
      return await res.json();
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value / 100); // Convert cents to dollars
  };

  // Format time in minutes to a readable format
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
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
        <p>Error loading top developers</p>
        <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Earning Developers</CardTitle>
          <CardDescription>
            Developers with the highest earnings for the selected month
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
      </CardHeader>
      <CardContent>
        {developers && developers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Premium Time</TableHead>
                <TableHead>Websites</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {developers.map((dev: any, index: number) => (
                <TableRow key={dev.developerId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{dev.developerName || `Developer ${dev.developerId}`}</TableCell>
                  <TableCell>{formatCurrency(dev.amount)}</TableCell>
                  <TableCell>{formatTime(dev.premiumMinutes)}</TableCell>
                  <TableCell>{dev.websitesCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No data available for {format(new Date(`${selectedMonth}-01`), "MMMM yyyy")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}