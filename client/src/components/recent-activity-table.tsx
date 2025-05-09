import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

export function RecentActivityTable() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/analytics/recent-activity"],
  });

  // Sample data for visualization
  const recentActivities = [
    {
      id: 1,
      user: { name: "John Doe", avatar: "JD", isPremium: true },
      timeSpent: "32 minutes",
      page: "/dashboard",
      date: "Today, 10:45 AM"
    },
    {
      id: 2,
      user: { name: "Alice Smith", avatar: "AS", isPremium: false },
      timeSpent: "18 minutes",
      page: "/features",
      date: "Today, 9:12 AM"
    },
    {
      id: 3,
      user: { name: "Robert Johnson", avatar: "RJ", isPremium: true },
      timeSpent: "45 minutes",
      page: "/analytics",
      date: "Yesterday, 4:30 PM"
    },
    {
      id: 4,
      user: { name: "Emily Davis", avatar: "ED", isPremium: true },
      timeSpent: "27 minutes",
      page: "/settings",
      date: "Yesterday, 2:15 PM"
    },
    {
      id: 5,
      user: { name: "Michael Brown", avatar: "MB", isPremium: false },
      timeSpent: "12 minutes",
      page: "/profile",
      date: "Yesterday, 10:20 AM"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>User interactions with your application</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Loading recent activity...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium mr-3">
                        {activity.user.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{activity.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.user.isPremium ? "Premium User" : "Free User"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{activity.timeSpent}</TableCell>
                  <TableCell>{activity.page}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
