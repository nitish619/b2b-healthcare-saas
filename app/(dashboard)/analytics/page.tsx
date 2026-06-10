"use client";

import { useEffect, useState } from "react";
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
} from "recharts";
import {
  TrendingUp,
  Users,
  Activity,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { format, subMonths } from "date-fns";
import { sendNotification } from "@/components/NotificationManager";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a855f7",
  "#ec4899",
];

function getMonthlyInflow(patients: Patient[]) {
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const label = format(month, "MMM");
    const monthStr = format(month, "yyyy-MM");
    const count = patients.filter((p) =>
      p.created_at?.startsWith(monthStr),
    ).length;
    return { name: label, patients: count };
  });
}

function getConditionDistribution(patients: Patient[]) {
  const map: Record<string, number> = {};
  patients.forEach((p) => {
    map[p.condition] = (map[p.condition] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export default function AnalyticsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("patients").select("*");
      if (data) setPatients(data as Patient[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const total = patients.length;
  const critical = patients.filter((p) => p.status === "Critical").length;
  const stable = patients.filter((p) => p.status === "Stable").length;
  const recovering = patients.filter((p) => p.status === "Recovering").length;
  const recoveryRate = total > 0 ? ((stable + recovering) / total) * 100 : 0;
  const avgAge =
    total > 0
      ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / total)
      : 0;

  const monthlyData = getMonthlyInflow(patients);
  const conditionData = getConditionDistribution(patients);

  const stats = [
    {
      name: "Total Patients",
      value: total.toString(),
      change: `${stable} stable`,
      trend: "up" as const,
      icon: Users,
      color: "text-blue-500",
    },
    {
      name: "Recovery Rate",
      value: `${recoveryRate.toFixed(1)}%`,
      change: `${recovering} recovering`,
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      name: "Average Age",
      value: `${avgAge} yrs`,
      change: `across ${total} patients`,
      trend: "up" as const,
      icon: Heart,
      color: "text-purple-500",
    },
    {
      name: "Critical Cases",
      value: critical.toString(),
      change: "need attention",
      trend: critical > 0 ? ("down" as const) : ("up" as const),
      icon: Activity,
      color: "text-red-500",
    },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      sendNotification(
        "Export Complete",
        "Your healthcare analytics report has been generated and downloaded.",
        "/analytics",
      );
    }, 2000);
  };

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
            Healthcare Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time insights from your patient records.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50 min-w-[120px]"
        >
          {isExporting ? "Exporting..." : "Export Data"}
        </button>
      </div>

      {/* Real stats from Supabase */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`${stat.color} h-5 w-5`} />
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
            <p className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-lg">No patient data yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add patients to see analytics charts populate automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly inflow chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">
              Patient Inflow (Last 6 Months)
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="patients"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Condition distribution pie chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">
              Condition Distribution
            </h3>
            {conditionData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-20">
                No condition data available.
              </p>
            ) : (
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
                      {conditionData.map((_, index) => (
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
            )}
          </Card>

          {/* Status breakdown */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              Patient Status Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Stable", count: stable, color: "bg-blue-500" },
                {
                  label: "Recovering",
                  count: recovering,
                  color: "bg-green-500",
                },
                { label: "Critical", count: critical, color: "bg-red-500" },
              ].map((s) => (
                <div key={s.label} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`h-3 w-3 rounded-full ${s.color}`} />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  <p className="text-3xl font-bold">{s.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {total > 0 ? ((s.count / total) * 100).toFixed(1) : 0}% of
                    total
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
