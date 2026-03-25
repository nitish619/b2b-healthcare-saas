"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { sendNotification } from "@/components/NotificationManager";

const patientData = [
  { name: "Jan", patients: 400, revenue: 2400 },
  { name: "Feb", patients: 300, revenue: 1398 },
  { name: "Mar", patients: 200, revenue: 9800 },
  { name: "Apr", patients: 278, revenue: 3908 },
  { name: "May", patients: 189, revenue: 4800 },
  { name: "Jun", patients: 239, revenue: 3800 },
  { name: "Jul", patients: 349, revenue: 4300 },
];

const conditionData = [
  { name: "Hypertension", value: 400 },
  { name: "Diabetes", value: 300 },
  { name: "Asthma", value: 300 },
  { name: "Cardiac", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate a brief export delay
    setTimeout(() => {
      setIsExporting(false);
      sendNotification(
        "Export Complete",
        "Your healthcare analytics report has been generated and downloaded.",
        "/analytics"
      );
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Healthcare Analytics
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into patient health trends and hospital
            performance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50 min-w-[120px]"
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            name: "Avg. Patient Stay",
            value: "4.2 Days",
            change: "+0.5",
            trend: "up",
            icon: Calendar,
            color: "text-blue-500",
          },
          {
            name: "Recovery Rate",
            value: "92.4%",
            change: "+2.1%",
            trend: "up",
            icon: TrendingUp,
            color: "text-green-500",
          },
          {
            name: "Patient Satisfaction",
            value: "4.8/5",
            change: "+0.2",
            trend: "up",
            icon: Users,
            color: "text-purple-500",
          },
          {
            name: "Emergency Cases",
            value: "12",
            change: "-4",
            trend: "down",
            icon: Activity,
            color: "text-red-500",
          },
        ].map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`${stat.color} h-5 w-5`} />
              <div
                className={`flex items-center text-xs font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">
            Patient Inflow vs Revenue
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Bar
                  dataKey="patients"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--secondary-foreground))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Condition Distribution</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conditionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
