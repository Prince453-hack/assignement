"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.get("/tasks/analytics").then((res) => setData(res.data));
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen animate-pulse text-2xl">
        Loading...
      </div>
    );

  const COLORS: Record<string, string> = {
    High: "#f87171",
    Medium: "#facc15",
    Low: "#34d399",
  };

  const totalTasks = data.priorityDistribution.reduce(
    (sum: number, item: any) => sum + item.count,
    0
  );

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold ml-2 ">Analytics Dashboard</h2>

        <div className="space-x-2">
          <Button onClick={() => router.push("/tasks")} variant="outline">
            Tasks
          </Button>

          <Button onClick={logout} variant="default">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Task Priority Distribution</CardTitle>
            <CardDescription>By priority level</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.priorityDistribution}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.priorityDistribution.map(
                    (entry: any, index: number) => (
                      <Cell key={index} fill={COLORS[entry._id] || "#ccc"} />
                    )
                  )}
                  <Label
                    value={`${totalTasks} Tasks`}
                    position="center"
                    className="fill-foreground text-xl font-bold"
                  />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Tasks due soon</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {data.upcomingTasks.length > 0 ? (
              data.upcomingTasks.map((task: any) => (
                <li key={task._id}>
                  <strong>{task.title}</strong> – {task.dueDate?.slice(0, 10)}
                </li>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming tasks</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
