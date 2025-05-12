import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function TopDevelopers() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );

  // Generate months for dropdown (12 months back)
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    return { value: monthStr, label };
  });

  // Fetch top earning developers
  const { data: topDevelopers, isLoading } = useQuery({
    queryKey: ["/api/admin/top-developers", month],
    queryFn: async () => {
      const response = await apiRequest(
        "GET",
        `/api/admin/top-developers?month=${month}`
      );
      return await response.json();
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Top Earning Developers</h2>
          <p className="text-muted-foreground">
            Developers who earned the most revenue in the selected month
          </p>
        </div>
        <div className="w-full md:w-60">
          <Select
            value={month}
            onValueChange={(value) => setMonth(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
          <CardDescription>
            Top 10 developers based on premium user engagement time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Total Websites</TableHead>
                  <TableHead>Premium Minutes</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDevelopers?.length ? (
                  topDevelopers.map((dev, index) => (
                    <TableRow key={dev.developerId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {dev.developerName || `Developer ${dev.developerId}`}
                      </TableCell>
                      <TableCell>{dev.websiteCount || 0}</TableCell>
                      <TableCell>{dev.premiumMinutes?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">
                        ${((dev.amount || 0) / 100).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No data available for this month.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer Insights</CardTitle>
          <CardDescription>
            Additional metrics about developer performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Active Developers
              </h3>
              <p className="text-2xl font-bold">
                {topDevelopers?.length || 0}
              </p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Total Premium Minutes
              </h3>
              <p className="text-2xl font-bold">
                {topDevelopers?.reduce((sum, dev) => sum + (dev.premiumMinutes || 0), 0).toLocaleString() || 0}
              </p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Total Earnings
              </h3>
              <p className="text-2xl font-bold">
                ${((topDevelopers?.reduce((sum, dev) => sum + (dev.amount || 0), 0) || 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}