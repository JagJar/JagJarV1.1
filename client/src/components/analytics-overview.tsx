import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export function AnalyticsOverview() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/analytics/overview"],
  });
  
  // Sample data for visualization
  const timeData = [
    { date: 'Jan 01', hours: 142 },
    { date: 'Jan 08', hours: 189 },
    { date: 'Jan 15', hours: 231 },
    { date: 'Jan 22', hours: 256 },
    { date: 'Jan 29', hours: 312 },
    { date: 'Feb 05', hours: 275 },
    { date: 'Feb 12', hours: 298 },
    { date: 'Feb 19', hours: 344 },
    { date: 'Feb 26', hours: 385 },
    { date: 'Mar 05', hours: 421 },
    { date: 'Mar 12', hours: 465 },
    { date: 'Mar 19', hours: 498 },
    { date: 'Mar 26', hours: 510 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time Tracked
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">2,450 hours</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">1,285</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              <span>+8.3% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Earnings
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">$1,245.32</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              <span>+15.7% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#4c5fd5" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
