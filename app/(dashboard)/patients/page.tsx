"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, Button, Input } from "@/components/ui";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Filter,
  MoreVertical,
  User,
  Calendar,
  Activity,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function PatientsPage() {
  const { patients, viewMode, setViewMode } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor patient records and health status.
          </p>
        </div>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, condition..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-8"
          >
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-bold">{patient.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        ID: #{patient.id}
                      </p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm">
                    <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">
                      Condition:
                    </span>
                    <span className="font-medium">{patient.condition}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">
                      Last Visit:
                    </span>
                    <span className="font-medium">{patient.lastVisit}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                      patient.status === "Critical"
                        ? "bg-red-500/10 text-red-500"
                        : patient.status === "Recovering"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {patient.status}
                  </span>
                  <Link href={`/patients/${patient.id}`}>
                    <Button variant="ghost" className="text-xs h-8 px-2 cursor-pointer">
                      View Details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                      Condition
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                      Last Visit
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {patient.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              ID: #{patient.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{patient.condition}</td>
                      <td className="px-6 py-4 text-sm">{patient.lastVisit}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                            patient.status === "Critical"
                              ? "bg-red-500/10 text-red-500"
                              : patient.status === "Recovering"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/patients/${patient.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs cursor-pointer"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
