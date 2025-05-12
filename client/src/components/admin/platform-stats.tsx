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
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Mock color data for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DF3"];

export default function PlatformStats() {
  const [timeframe, setTimeframe] = useState("month");

  // Fetch platform revenue stats
  const { data: revenueStats, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["/api/admin/revenue-stats", timeframe],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/revenue-stats?timeframe=${timeframe}`);
      return await response.json();
    },
  });

  // Fetch user stats
  const { data: userStats, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/user-stats", timeframe],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/user-stats?timeframe=${timeframe}`);
      return await response.json();
    },
  });

  const isLoading = isLoadingRevenue || isLoadingUsers;

  // If data is not loaded yet, display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prepare data for pie chart
  const pieData = [
    { name: "Platform Revenue", value: revenueStats?.platformRevenue || 0 },
    { name: "Developer Payouts", value: revenueStats?.developerPayouts || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Platform Statistics</h2>
        <p className="text-muted-foreground mb-8">
          Overview of platform performance, revenue, and user metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>All time platform revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${((revenueStats?.totalRevenue || 0) / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Total active users in the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.activeUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Premium Subscribers</CardTitle>
            <CardDescription>Current premium subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userStats?.premiumUsers || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue over the past months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueStats?.monthlyRevenue || []}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [
                      `$${(value / 100).toFixed(2)}`,
                      "Revenue",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    name="Revenue"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>How platform revenue is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `$${(value / 100).toFixed(2)}`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}