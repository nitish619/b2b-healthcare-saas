"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import {
  Users,
  Activity,
  TrendingUp,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { format, subDays, parseISO } from "date-fns";

function getActivityLast7Days(patients: Patient[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const label = format(day, "EEE");
    const dateStr = format(day, "yyyy-MM-dd");
    const count = patients.filter((p) =>
      p.created_at?.startsWith(dateStr),
    ).length;
    return { name: label, patients: count };
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPatients(data as Patient[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const total = patients.length;
  const critical = patients.filter((p) => p.status === "Critical").length;
  const recovering = patients.filter((p) => p.status === "Recovering").length;
  const stable = patients.filter((p) => p.status === "Stable").length;
  const recoveryRate =
    total > 0 ? Math.round(((stable + recovering) / total) * 100) : 0;

  const stats = [
    {
      name: "Total Patients",
      value: total.toString(),
      sub: `${stable} stable`,
      trend: "up" as const,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Critical Cases",
      value: critical.toString(),
      sub: "need attention",
      trend: critical > 0 ? ("down" as const) : ("up" as const),
      icon: Activity,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      name: "Recovering",
      value: recovering.toString(),
      sub: "in progress",
      trend: "up" as const,
      icon: Heart,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      name: "Recovery Rate",
      value: `${recoveryRate}%`,
      sub: "stable + recovering",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const activityData = getActivityLast7Days(patients);
  const recentPatients = patients.slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <button
          onClick={() => router.push("/patients")}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Manage Patients
        </button>
      </div>

      {/* Stats cards — real counts from Supabase */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className={stat.bg + " p-2 rounded-lg"}>
                <stat.icon className={stat.color + " h-6 w-6"} />
              </div>
              <div
                className={`flex items-center text-xs font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Area chart — patients added per day (last 7 days) */}
        <Card className="col-span-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Patient Activity</h3>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
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
                  allowDecimals={false}
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

        {/* Recent patients — live from Supabase */}
        <Card className="col-span-3 p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Patients</h3>
          {recentPatients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No patients yet. Add your first patient!
            </p>
          ) : (
            <div className="space-y-6">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between"
                >
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
                    <p className="text-xs font-medium">{patient.last_visit}</p>
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
          )}
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
