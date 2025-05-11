import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, DollarSign, Users, Clock, CalendarIcon } from "lucide-react";
import { format, subMonths } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function PlatformStats() {
  const [selectedMonths, setSelectedMonths] = useState(6);

  // Fetch platform revenue statistics
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/admin/revenue/stats", selectedMonths],
    queryFn: async () => {
      const res = await fetch("/api/admin/revenue/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch platform statistics");
      }
      return await res.json();
    },
  });

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
        <p>Error loading platform statistics</p>
        <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value / 100); // Convert cents to dollars
  };

  // Filter data for the selected number of months
  const filteredData = stats
    ? stats
        .sort((a: any, b: any) => {
          return new Date(a.month + "-01").getTime() - new Date(b.month + "-01").getTime();
        })
        .slice(-selectedMonths)
        .map((item: any) => ({
          ...item,
          month: format(new Date(item.month + "-01"), "MMM yyyy"),
          formattedTotal: formatCurrency(item.totalRevenue),
          formattedDistributed: formatCurrency(item.totalDistributed),
          formattedPlatformFee: formatCurrency(item.platformFee),
        }))
    : [];

  // Calculate summary statistics
  const summary = filteredData.reduce(
    (acc: any, item: any) => {
      return {
        totalRevenue: acc.totalRevenue + item.totalRevenue,
        totalDistributed: acc.totalDistributed + item.totalDistributed,
        platformFee: acc.platformFee + item.platformFee,
        developerCount: Math.max(acc.developerCount, item.developerCount),
      };
    },
    { totalRevenue: 0, totalDistributed: 0, platformFee: 0, developerCount: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Last {selectedMonths} months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Distributed to Developers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalDistributed)}</div>
            <p className="text-xs text-muted-foreground">
              Last {selectedMonths} months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.platformFee)}</div>
            <p className="text-xs text-muted-foreground">
              Last {selectedMonths} months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Developers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.developerCount}</div>
            <p className="text-xs text-muted-foreground">
              Peak from last {selectedMonths} months
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <select
              className="text-sm border rounded px-2 py-1"
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(Number(e.target.value))}
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>
        </div>

        <TabsContent value="revenue" className="border rounded-lg p-4">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)} 
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  name="Total Revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="platformFee"
                  name="Platform Fee"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="border rounded-lg p-4">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)} 
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="totalDistributed"
                  name="Distributed to Developers"
                  stackId="a"
                  fill="#8884d8"
                />
                <Bar
                  dataKey="platformFee"
                  name="Platform Fee"
                  stackId="a"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}