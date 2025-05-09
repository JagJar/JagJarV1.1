import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export function UserGrowthChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/analytics/user-growth"],
  });
  
  // Sample data for visualization
  const growthData = [
    { month: 'Jan', new: 65, returning: 90 },
    { month: 'Feb', new: 78, returning: 112 },
    { month: 'Mar', new: 95, returning: 135 },
    { month: 'Apr', new: 87, returning: 164 },
    { month: 'May', new: 105, returning: 192 },
    { month: 'Jun', new: 120, returning: 223 },
    { month: 'Jul', new: 134, returning: 246 },
    { month: 'Aug', new: 112, returning: 289 },
    { month: 'Sep', new: 98, returning: 310 },
    { month: 'Oct', new: 127, returning: 325 },
    { month: 'Nov', new: 145, returning: 346 },
    { month: 'Dec', new: 123, returning: 367 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New vs returning users over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="new" 
                name="New Users"
                stackId="1"
                stroke="#4c5fd5" 
                fill="#4c5fd5" 
              />
              <Area 
                type="monotone" 
                dataKey="returning" 
                name="Returning Users"
                stackId="1"
                stroke="#ff6b35" 
                fill="#ff6b35" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
