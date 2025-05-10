import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function TimeDistributionChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/analytics/time-distribution"],
  });
  
  // Sample data for visualization
  const distributionData = [
    { name: 'Dashboard', value: 45 },
    { name: 'Analytics', value: 25 },
    { name: 'User Profile', value: 15 },
    { name: 'Settings', value: 10 },
    { name: 'Other', value: 5 }
  ];
  
  const COLORS = ['#4c5fd5', '#ff6b35', '#1ed760', '#f59e0b', '#ef4444'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Distribution</CardTitle>
        <CardDescription>How users spend time on your application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '3 3' }}
                label={({ name, percent }) => `${name}:\n${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                fontSize={12}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [`${value}%`, 'Usage']}
                contentStyle={{ fontSize: '12px', padding: '8px', borderRadius: '4px' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '16px' }}
                iconSize={10}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
