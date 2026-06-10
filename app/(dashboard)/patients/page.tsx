"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { Card, Button, Input } from "@/components/ui";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Calendar,
  Activity,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { AddPatientModal } from "@/components/patients/AddPatientModal";

type FilterMode = "all" | "mine";

export default function PatientsPage() {
  const { viewMode, setViewMode, user } = useStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [filterMode]);

  async function fetchPatients() {
    setLoading(true);
    let query = supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    // "My Patients" — only rows where created_by = current user's id
    if (filterMode === "mine" && user?.id) {
      query = query.eq("created_by", user.id);
    }

    const { data } = await query;
    if (data) setPatients(data as Patient[]);
    setLoading(false);
  }

  function handlePatientAdded(newPatient: Patient) {
    setPatients((prev) => [newPatient, ...prev]);
  }

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {showModal && user?.id && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePatientAdded}
          createdBy={user.id}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor patient records and health status.
          </p>
        </div>
        <Button className="flex items-center" onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm flex-wrap gap-3">
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
        </div>

        <div className="flex items-center space-x-3">
          {/* My Patients / All Patients toggle */}
          <div className="flex items-center bg-muted p-1 rounded-lg text-sm font-medium">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterMode === "all"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Patients
            </button>
            <button
              onClick={() => setFilterMode("mine")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterMode === "mine"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Patients
            </button>
          </div>

          {/* Grid / List toggle */}
          <div className="flex items-center bg-muted p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-lg">No patients found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery
              ? "Try a different search term."
              : filterMode === "mine"
                ? "You haven't added any patients yet."
                : 'Click "Add New Patient" to get started.'}
          </p>
        </div>
      ) : (
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
                          {patient.age}y • {patient.gender}
                        </p>
                      </div>
                    </div>
                    {/* Indicate if this patient belongs to the logged-in user */}
                    {patient.created_by === user?.id && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        Mine
                      </span>
                    )}
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
                      <span className="font-medium">{patient.last_visit}</span>
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
                      <Button
                        variant="ghost"
                        className="text-xs h-8 px-2 cursor-pointer"
                      >
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
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">
                                  {patient.name}
                                </p>
                                {patient.created_by === user?.id && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                    Mine
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground">
                                {patient.age}y • {patient.gender}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {patient.condition}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {patient.last_visit}
                        </td>
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
      )}
    </div>
  );
}
