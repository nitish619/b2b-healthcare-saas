"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import {
  Users,
  Activity,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import router from "next/router";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const data = [
  { name: "Mon", patients: 40, critical: 24 },
  { name: "Tue", patients: 30, critical: 13 },
  { name: "Wed", patients: 20, critical: 98 },
  { name: "Thu", patients: 27, critical: 39 },
  { name: "Fri", patients: 18, critical: 48 },
  { name: "Sat", patients: 23, critical: 38 },
  { name: "Sun", patients: 34, critical: 43 },
];

const stats = [
  {
    name: "Total Patients",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Critical Cases",
    value: "42",
    change: "-2.4%",
    trend: "down",
    icon: Activity,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Appointments",
    value: "84",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    name: "Revenue",
    value: "$42,500",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Chavan. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className={stat.bg + " p-2 rounded-lg"}>
                <stat.icon className={stat.color + " h-6 w-6"} />
              </div>
              <div
                className={`flex items-center text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Patient Activity</h3>
            <select className="bg-muted border-none rounded-md text-xs px-2 py-1 focus:ring-1 ring-primary">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="col-span-3 p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Patients</h3>
          <div className="space-y-6">
            {[
              {
                name: "John Doe",
                condition: "Hypertension",
                time: "2 mins ago",
                status: "Stable",
              },
              {
                name: "Jane Smith",
                condition: "Diabetes",
                time: "15 mins ago",
                status: "Recovering",
              },
              {
                name: "Robert Brown",
                condition: "Post-Op",
                time: "1 hour ago",
                status: "Critical",
              },
              {
                name: "Emily Davis",
                condition: "Asthma",
                time: "3 hours ago",
                status: "Stable",
              },
            ].map((patient, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{patient.time}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      patient.status === "Critical"
                        ? "bg-red-500/10 text-red-500"
                        : patient.status === "Recovering"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full mt-8 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors cursor-pointer"
            onClick={() => router.push("/patients")}
          >
            View All Patients
          </button>
        </Card>
      </div>
    </div>
  );
}
